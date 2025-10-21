import BoardComponent from '@/components/i-board/board';

const IboardPage = () => {
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">I-Board</h1>
      <p>Welcome to your I-board!</p>
      <BoardComponent />
    </div>
  );
};

export default IboardPage;
