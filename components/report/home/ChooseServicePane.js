// @flow

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import type { ServiceSummary } from '../../../data/types';

import SectionHeader from '../../common/SectionHeader';

export type Props = {|
  description: string,
  suggestedServiceSummaries: ?ServiceSummary[],
|};

function renderSummaryRow(problemDescription: string, { code, name, description }: { code: string, name: string, description: ?string }) {
  return (
    <div className="dr" key={code}>
      <Link href={`/report?code=${code}&description=${encodeURIComponent(problemDescription)}`} as={`/report/${code}`}><a className="dr-h">
        <div className="dr-ic" style={{ transform: 'translateY(-49%) rotateZ(-90deg)' }}><svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 8.5 18 25"><path className="dr-i" d="M16 21L.5 33.2c-.6.5-1.5.4-2.2-.2-.5-.6-.4-1.6.2-2l12.6-10-12.6-10c-.6-.5-.7-1.5-.2-2s1.5-.7 2.2-.2L16 21z" /></svg></div>
        <div className="dr-t">{name}</div>
        <div className="dr-st">{description}</div>
      </a></Link>
    </div>
  );
}

function renderGeneralRequestRow(problemDescription: string) {
  return renderSummaryRow(problemDescription, {
    code: 'BOS311GEN',
    name: 'General Request',
    // TODO(finh): Add something here
    description: '',
  });
}

function renderLoading() {
  return (
    <div className="t--info m-v300">
      Matching your problem to BOS:311 services…
    </div>
  );
}

function renderTypeDescription() {
  return (
    <div className="t--info m-v300">
      Type in your problem above to get matched with BOS:311 services.
    </div>
  );
}

function renderSuggestions(problemDescription: string, suggestedServiceSummaries: ServiceSummary[]) {
  return (
    <div>
      <div className="t--info m-v300">
        We’ve matched these services to your problem. Pick one to continue.
      </div>

      <div className="m-v500">
        { suggestedServiceSummaries.map((s) => renderSummaryRow(problemDescription, s)) }
      </div>

      <div className="t--info m-v300">
        If none of those seem like a good fit, you can submit a General Request.
      </div>

      <div className="m-v500">{renderGeneralRequestRow(problemDescription)}</div>
    </div>
  );
}

function renderNoSuggestions(problemDescription: string) {
  return (
    <div>
      <div className="t--info m-v300">
        We weren’t able to automatically match your problem with a service.
        File a General Request and someone will help you out.
      </div>

      <div className="m-v500">{renderGeneralRequestRow(problemDescription)}</div>
    </div>
  );
}

export default function ChooseServicePane({ description, suggestedServiceSummaries }: Props) {
  return (
    <div>
      <Head>
        <title>BOS:311 — Choose a Service</title>
      </Head>

      <div className="p-a300 p-a800--xl" style={{ paddingBottom: '.75rem' }}>

        <SectionHeader>BOS:311 — File a Report</SectionHeader>

        <div className="m-v500 t--intro">
          “{ description }”
        </div>
      </div>

      <div className="b b--g p-a300 p-a800--xl">
        <h2 className="stp">
          How can we help?
        </h2>

        { !suggestedServiceSummaries && renderLoading() }
        { suggestedServiceSummaries && suggestedServiceSummaries.length > 0 && renderSuggestions(description, suggestedServiceSummaries) }
        { suggestedServiceSummaries && suggestedServiceSummaries.length === 0 && description.length === 0 && renderTypeDescription() }
        { suggestedServiceSummaries && suggestedServiceSummaries.length === 0 && description.length > 0 && renderNoSuggestions(description) }
      </div>
    </div>
  );
}
