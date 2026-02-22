'use client';

import { useState, useId } from 'react';

/**
 * FAQItem — single accessible accordion item.
 *
 * Markup pattern:
 *   <div>
 *     <dt>
 *       <button aria-expanded aria-controls>Question text</button>
 *     </dt>
 *     <dd id="..." hidden>Answer text</dd>
 *   </div>
 *
 * Why not <details>/<summary>?
 *   The spec forbids heading elements (h1-h6) inside <summary> — phrasing
 *   content only. Using button+aria is the WCAG 2.1 recommended pattern.
 */
function FAQItem({ question, answer, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);
    const uid = useId();
    const answerId = `faq-answer-${uid}`;

    return (
        <div className="card group">
            <dt>
                <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={answerId}
                    onClick={() => setOpen((v) => !v)}
                    className="w-full p-5 sm:p-6 flex justify-between items-center text-left gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-800 rounded-xl"
                >
                    <span className="font-semibold text-sm sm:text-base text-white pr-2">
                        {question}
                    </span>
                    <span
                        aria-hidden="true"
                        className={`text-primary-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            focusable="false"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </span>
                </button>
            </dt>
            <dd
                id={answerId}
                hidden={!open}
                className="px-5 sm:px-6 pb-5 sm:pb-6 text-dark-300 text-sm sm:text-base"
            >
                <p>{answer}</p>
            </dd>
        </div>
    );
}

/**
 * FAQAccordion — renders a semantic <dl> list of FAQItem accordions.
 *
 * @param {Object[]} faqs  - Array of { question, answer }
 * @param {string}   label - Optional aria-label for the <dl>
 */
export default function FAQAccordion({ faqs = [], label }) {
    if (!faqs.length) return null;

    return (
        <dl
            className="space-y-3"
            aria-label={label}
        >
            {faqs.map((faq, index) => (
                <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                />
            ))}
        </dl>
    );
}
