import {useEffect, useState} from "react";
import axios from "axios";
import {useSearchParams} from "react-router-dom";
import DOMPurify from 'dompurify';

export default function Plugin() {
    const [content, setContent] = useState("");
    const [params, setParams] = useSearchParams();

    useEffect(() => {
        getContent();
    }, [])

    function getContent() {
        axios.get(`/api/plugins/${params.get("name")}/ui`).then((r) => {
            if (r.status === 200) {
                setContent(r.data);
            }
        })
    }


    return (<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />)
}
