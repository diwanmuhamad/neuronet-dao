"use client";
import React from "react";

type Props = {
  isOpen: boolean;
  isProcessing: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const DeleteConfirmationModal: React.FC<Props> = ({ isOpen, isProcessing, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-tertiary">
          <div className="modal-header border-bottom border-dark">
            <h5 className="modal-title text-white">Confirm Delete</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onCancel} disabled={isProcessing}></button>
          </div>
          <div className="modal-body">
            <p className="text-white">Are you sure you want to delete this item? This action cannot be undone.</p>
          </div>
          <div className="modal-footer border-top border-dark">
            <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={isProcessing}>
              Cancel
            </button>
            <button type="button" className="btn btn--quaternary" onClick={onConfirm} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Deleting...
                </>
              ) : (
                "Delete Item"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;


