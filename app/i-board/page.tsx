import BoardComponent from '@/components/i-board/board';
import BoardWrapper from '@/components/i-board/board-wrapper';
import { fetchData } from '@/lib/feth-utils';
import { ResListStocks, Stock } from '@/types';
import { Suspense } from 'react';

const IboardPage = async () => {
  return (
    <div className="p-2">
      <h1 className="mb-4 text-2xl font-bold">I-Board</h1>
      <Suspense fallback={'Loading...'}>
        <BoardWrapper />
      </Suspense>
    </div>
  );
};

export default IboardPage;
