// @flow

import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import { AppStore } from '../../../data/store';
import type { SearchRequest } from '../../../data/types';

import RecentRequests from './RecentRequests';

jest.mock('../../../data/dao/search-requests');
const searchRequests: JestMockFn = (require('../../../data/dao/search-requests'): any).default;

export const MOCK_REQUEST: SearchRequest = {
  id: '17-000000001',
  service: {
    name: 'Cosmic Intervention',
  },
  description: 'I think that Thanos is here',
  status: 'open',
  address: 'City Hall Plaza, Boston, MA 02131',
  location: {
    lat: 4,
    lng: 5,
  },
  updatedAtRelativeString: '4 minutes ago',
  mediaUrl: null,
};

describe('rendering', () => {
  let store;

  beforeEach(() => {
    store = new AppStore();
    store.requestSearch.results = [MOCK_REQUEST];
    searchRequests.mockReturnValue(new Promise(() => {}));
  });

  test('results loaded', () => {
    const component = renderer.create(
      <RecentRequests loopbackGraphql={jest.fn()} store={store} />,
    );

    expect(component.toJSON()).toMatchSnapshot();
  });

  test('with request selected', () => {
    store.requestSearch.selectedRequest = MOCK_REQUEST;

    const component = renderer.create(
      <RecentRequests loopbackGraphql={jest.fn()} store={store} />,
    );

    expect(component.toJSON()).toMatchSnapshot();
  });
});

test('searching', () => {
  const store = new AppStore();
  const loopbackGraphql = jest.fn();

  searchRequests.mockReturnValue(new Promise(() => {}));
  const wrapper = mount(
    <RecentRequests store={store} loadRequests={false} loopbackGraphql={loopbackGraphql} />,
  );

  const inputWrapper = wrapper.find('input[type="text"]').first();
  inputWrapper.simulate('input', { target: { value: 'Mewnir' } });
  expect(inputWrapper.getDOMNode().value).toEqual('Mewnir');

  wrapper.find('form').simulate('submit');
  expect(searchRequests).toHaveBeenCalledWith(loopbackGraphql, 'Mewnir');
});