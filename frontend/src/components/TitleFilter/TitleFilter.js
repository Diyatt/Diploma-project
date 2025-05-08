import React from "react";

function TitleFilter({ text }) {
  return <h4 className="mb-0">{text}</h4>;
}

function IborrowedContent({ text }) {
  return (
    <div className="Iborrowed-content">
      <div className="Iborrowed-header">
        <div>
          <TitleFilter text={ text } />
        </div>
        <div>
          <div className="btn-group btn-group-lg" role="group" aria-label="Large button group">
            <button type="button" className="btn btn-Iborrowed">
              <svg width="23" height="20" viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11.4141 8.2C17.0232 8.2 21.5703 6.58822 21.5703 4.6C21.5703 2.61177 17.0232 1 11.4141 1C5.80492 1 1.25781 2.61177 1.25781 4.6C1.25781 6.58822 5.80492 8.2 11.4141 8.2Z"
                  stroke="black"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M1.25781 4.59961C1.26045 8.21199 4.49338 11.35 9.07031 12.1828V17.1996C9.07031 18.1937 10.1196 18.9996 11.4141 18.9996C12.7085 18.9996 13.7578 18.1937 13.7578 17.1996V12.1828C18.3347 11.35 21.5677 8.21199 21.5703 4.59961"
                  stroke="black"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button type="button" className="btn btn-Iborrowed">Filter By</button>
            <button type="button" className="btn btn-Iborrowed">Data</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IborrowedContent;
