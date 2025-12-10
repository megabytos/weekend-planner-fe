import CandidateList from './candidate-list';

export default function CandidatePanel({ candidates, addCandidate, lockedCityKey }) {
  return (
    <div>
      <h1 className="font-medium text-[16px] leading-6 lg:text-[22px] lg:mb-8">
        Candidates
      </h1>
      <CandidateList
        candidates={candidates}
        addCandidate={addCandidate}
        lockedCityKey={lockedCityKey}
      />
    </div>
  );
}
