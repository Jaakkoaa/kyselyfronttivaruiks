import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Loading from "./Loading";
import EditInquiryStepper from "./EditInquiryStepper";

export default function EditInquiry(props) {

    const { id } = useParams()

    const [inquiry, setInquiry] = useState({})
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() =>  fetchInquiry() ,[])

    const fetchInquiry = () => {
        fetch(`${props.url}/api/inquiries/${id}`)
        .then(res => res.json())
        .then(data => {
            setInquiry(data)
            fetchQuestions(data._links.questions.href)
            setLoading(false)
        })
        .catch(err => console.error(err))
    }

    const fetchQuestions = (link) => {
        fetch(link)
        .then(res => res.json())
        .then(data => setQuestions(data._embedded.questions))
        .catch(err => console.error(err))
    }

    const editInquiryName = (newName) => {
        console.log(newName)
        setInquiry({...inquiry, name: newName})
        console.log(inquiry)
        fetch(inquiry._links.self.href, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('jwt')
            },
            body: JSON.stringify(inquiry)
        })
        .then(res => {
            if (res.ok) {
                // ILMOITETAANKO SNACKBARILLA?
                console.log(res.json())
            }
        })
        .catch(err => console.error(err))
    }

    const deleteQuestion = (question) => {
        fetch(question._links.self.href, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('jwt')
            }
        })
        .then(res => {
            if (res.ok) {
                //fetchInquiry()
            }
        })
        .catch(err => console.error(err))
    }

    while (loading) {
        return <Loading msg="Ladataan kyselyä..." />
    }

    return (
        <div>
        <EditInquiryStepper 
            inquiry={inquiry} 
            questions={questions} 
            editInquiryName={editInquiryName}
            deleteQuestion={deleteQuestion}
            />
        </div>
    )
}