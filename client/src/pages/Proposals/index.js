// client/src/pages/Proposals/index.js
import React from 'react';
import ProposalList from '../../components/Proposals/ProposalList';

const ProposalsPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <ProposalList />
    </div>
  );
};

export default ProposalsPage;