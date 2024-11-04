
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment  */
// @ts-nocheck
import { useState, useEffect } from 'react';
import { contractInteractions } from '@/lib/contract/client';

const useGovernance = () => {
  const [proposals, setProposals] = useState<string[]>([]);
  const [votes, setVotes] = useState<bigint[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGovernanceData = async () => {
      try {
        // Fetch proposal count
        const proposalCount = await contractInteractions.viewFunctions.getProposalCount();
        
        // Fetch all proposals
        const fetchedProposals = [];
        for (let i = 0; i < Number(proposalCount); i++) {
          const proposal = await contractInteractions.viewFunctions.getProposal(i);
          fetchedProposals.push(proposal);
        }

        // Fetch votes for each proposal
        const fetchedVotes = await Promise.all(
          fetchedProposals.map((_, index) => contractInteractions.viewFunctions.getVotes(index))
        );

        setProposals(fetchedProposals);
        setVotes(fetchedVotes);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchGovernanceData();
  }, []);

  // Function to vote for a proposal
  const voteForProposal = async (proposalId: number) => {
    try {
      await contractInteractions.writeFunctions.voteForProposal(proposalId);
      // Refresh data or update vote count here
    } catch (err) {
      setError(err.message);
    }
  };

  // Function to propose an improvement
  const proposeImprovement = async (proposal: string) => {
    try {
      await contractInteractions.writeFunctions.proposeImprovement(proposal);
      // Refresh proposals list here
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    proposals,
    votes,
    error,
    voteForProposal,
    proposeImprovement
  };
};

export default useGovernance;