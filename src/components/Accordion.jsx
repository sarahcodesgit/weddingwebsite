import { useState } from 'react'

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="accordion">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        const panelId = `faq-panel-${index}`
        return (
          <article className={`accordion__item ${isOpen ? 'is-open' : ''}`} key={item.question}>
            <h3>
              <button
                className="accordion__trigger"
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span>{item.question}</span>
                <span className="accordion__symbol" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
            </h3>
            <div className="accordion__panel" id={panelId} hidden={!isOpen}>
              <p>{item.answer}</p>
            </div>
          </article>
        )
      })}
    </div>
  )
}
