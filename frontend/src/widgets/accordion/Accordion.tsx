import React from 'react';

interface QuestionAnswer {
    _id?: string;
    question: string;
    answer: string;
}

interface AccordionProps {
    questionsAndAnswers?: QuestionAnswer[];
}

const Accordion: React.FC<AccordionProps> = ({ questionsAndAnswers = [] }) => {
    return (
        <div className="accordion" id="accordionExample">
            {questionsAndAnswers.map((qa, index) => (
                <div className="accordion-item" key={qa._id || index}>
                    <h2 className="accordion-header" id={`heading${index}`}>
                        <button
                            className="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse${index}`}
                            aria-expanded={index === 0 ? 'true' : 'false'}
                            aria-controls={`collapse${index}`}
                        >
                            {qa.question || `Question ${index + 1}`}
                        </button>
                    </h2>
                    <div
                        id={`collapse${index}`}
                        className={`accordion-collapse collapse ${
                            index === 0 ? 'show' : ''
                        }`}
                        aria-labelledby={`heading${index}`}
                    >
                        <div className="accordion-body">
                            {qa.answer || 'No answer provided.'}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Accordion;
