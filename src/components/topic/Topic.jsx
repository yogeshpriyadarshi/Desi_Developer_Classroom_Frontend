import { useParams } from "react-router-dom";
import Interview from "./Interview";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosIntances";

function Topic() {
    // interview slug from url
    const { slug } = useParams();

    const [topicData, setTopicData] = useState(null);
    const [topic, setTopic] = useState(null);

    // get topic id from slug
    useEffect(() => {
        const fetchTopic = async () => {
            try {
                const response = await axiosInstance.get(`/topics/fetch-by-slug/${slug}`);
                setTopic(response.data.topic);
                console.log("Fetched topic:", response.data.topic);
            } catch (error) {
                console.error("Error fetching topic:", error);
            }
        };

        fetchTopic();
    }, [slug]);

    useEffect(() => {
        const fetchTopicData = async () => {
            try {
                const response = await axiosInstance.get(`/topics/fetch-by-slug/${slug}`);
                setTopicData(response.data.topic);
                console.log("Fetched topic data:", response.data.topic);
            } catch (error) {
                console.error("Error fetching topic data:", error);
            }
        };

        fetchTopicData();
    }, [slug]);

    return (
        <>
            <Interview topicId={topic?._id} />
        </>
    );
}

export default Topic;   