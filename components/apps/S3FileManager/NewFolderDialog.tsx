import { useState } from "react";
import {
  StyledModalDialog,
  StyledModalOverlay,
} from "components/apps/S3FileManager/StyledS3FileManager";

type NewFolderDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (folderName: string) => void;
};

const NewFolderDialog: FC<NewFolderDialogProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [folderName, setFolderName] = useState("New Folder");

  if (!isOpen) return null;

  const handleSubmit = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    if (folderName.trim()) {
      onCreate(folderName.trim());
      onClose();
    }
  };

  return (
    <StyledModalOverlay onClick={onClose}>
      <StyledModalDialog onClick={(e) => e.stopPropagation()}>
        <h3>New S3 Directory / Folder</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Folder Name</label>
            <input
              autoFocus
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="btn-primary" type="submit">
              Create Folder
            </button>
          </div>
        </form>
      </StyledModalDialog>
    </StyledModalOverlay>
  );
};

export default NewFolderDialog;
