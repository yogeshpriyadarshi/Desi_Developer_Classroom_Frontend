import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosIntances";

function Interview({ topicId }) {
    // Implementation for the Interview component
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeId, setActiveId] = useState(null); // for showing accordian behaviour
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState(null);

    const openModal = (item) => {
        setSelectedInterview(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedInterview(null);
        setIsModalOpen(false);
    };

    // You can use the topicId prop to fetch and display interview questions related to the topic

    // Fetch interview questions
    const getInterviews = async () => {
        setLoading(true);
        const res = await axiosInstance.get(`/interview/fetch-by-topic/${topicId}`);
        setInterviews(res.data.interviews);
        setLoading(false);
    };

    useEffect(() => {
        console.log("Topic ID in Interview component:", topicId);
        if (topicId) getInterviews();
    }, [topicId]);


    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {/* Interview List */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-semibold">Interview Questions</h2>

                        {interviews.map((item) => {
                            const isOpen = activeId === item._id;

                            return (
                                <div
                                    key={item._id}
                                    className=" shadow-md rounded-2xl p-5 flex flex-col gap-4 transition-all"
                                >
                                    <div className="flex justify-between items-center">
                                        {/* Question */}
                                        <div
                                            className="prose max-w-none  font-medium"
                                            dangerouslySetInnerHTML={{
                                                __html: item.question,
                                            }}
                                        />

                                        {/* Button */}
                                        <button
                                            onClick={() => openModal(item)}
                                            className="self-start bg-blue-500  px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                                        >
                                            {isOpen ? "Hide Explanation" : "Show Explanation"}
                                        </button>
                                    </div>

                                    {isModalOpen && selectedInterview && (
                                        <div
                                            onClick={closeModal}
                                            className="fixed inset-0 bg-white dark:bg-black bg-opacity-100 flex justify-center items-center z-50"
                                        >
                                            <div
                                                onClick={(e) => e.stopPropagation()}
                                                className=" w-full max-w-5xl rounded-2xl p-6 relative shadow-lg max-h-[90vh] overflow-y-auto"
                                            >
                                                {/* Close Button */}
                                                <button
                                                    onClick={closeModal}
                                                    className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                                                >
                                                    ✕
                                                </button>

                                                {/* Question */}
                                                <div
                                                    className="prose max-w-none  font-semibold mb-4"
                                                    dangerouslySetInnerHTML={{
                                                        __html: selectedInterview.question,
                                                    }}
                                                />

                                                {/* Explanation */}
                                                <div
                                                    className="prose max-w-none  border-t pt-3"
                                                    dangerouslySetInnerHTML={{
                                                        __html: selectedInterview.explanation,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

export default Interview;