import React, { useState, useImperativeHandle, forwardRef } from "react";
import "./GuideModal.css";

const GuideModal = forwardRef((props, ref) => {
  const [show, setShow] = useState(true);

  const closeModal = () => setShow(false);
  const openModal = () => setShow(true);
  useImperativeHandle(ref, () => ({
    openModal,
    closeModal,
  }));

  window.onclick = (event) => {
    if (event.target.id === "guideModal") {
      closeModal();
    }
  };
  window.onkeydown = (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  };

  return (
    <>
      {show && <div className="modal-backdrop show"></div>}
      <div
        className={show ? "modal d-block" : "modal"}
        tabIndex="-1"
        role="dialog"
        id="guideModal"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ backgroundColor: "#111" }}>
            <div className="modal-header">
              <h5 className="modal-title">How to play</h5>
              <div
                type="button"
                className="close"
                onClick={closeModal}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </div>
            </div>
            <div className="modal-body">
              <p>Guess the 5-letter English word in 6 tries. For each try:</p>
              <small>
                <ul>
                  <li>
                    <strong className="text-info">Pick a country</strong> to
                    reveal the word&apos;s translations in their language(s).
                  </li>
                  <li>
                    <strong className="text-info">Make a guess.</strong>
                  </li>
                </ul>
                <p className="italic">
                  Note: There&apos;s no feedback on the letters. Only clues are
                  the translations!
                </p>
              </small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

GuideModal.displayName = "GuideModal";

export default GuideModal;
