import { useState } from "react";
import {
  StyledModalDialog,
  StyledModalOverlay,
} from "components/apps/S3FileManager/StyledS3FileManager";

type NewFileDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (fileName: string, content?: string) => void;
};

const NewFileDialog: FC<NewFileDialogProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [fileName, setFileName] = useState("index.js");

  if (!isOpen) return null;

  const handleSubmit = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    if (fileName.trim()) {
      onCreate(fileName.trim());
      onClose();
    }
  };

  return (
    <StyledModalOverlay onClick={onClose}>
      <StyledModalDialog onClick={(e) => e.stopPropagation()}>
        <h3>New Code / Text File</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              File Name (with extension, e.g. .js, .ts, .json, .html, .md)
            </label>
            <input
              autoFocus
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="btn-primary" type="submit">
              Create & Edit
            </button>
          </div>
        </form>
      </StyledModalDialog>
    </StyledModalOverlay>
  );
};

export default NewFileDialog;
