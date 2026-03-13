function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 border-4 border-blue-600 border-dashed rounded-full animate-spin"></div>
        <h2 className="text-lg font-semibold text-gray-700">Please wait...</h2>
      </div>
    </div>
  );
}

export default Loading;
