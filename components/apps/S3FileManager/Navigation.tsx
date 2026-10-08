import { useRef } from "react";
import {
  StyledS3AddressBarContainer,
  StyledS3Toolbar,
} from "components/apps/S3FileManager/StyledS3FileManager";
import {
  AwsIcon,
  BackIcon,
  FilePlusIcon,
  FolderPlusIcon,
  ForwardIcon,
  GridViewIcon,
  ListViewIcon,
  RefreshIcon,
  UpIcon,
  UploadIcon,
} from "components/apps/S3FileManager/icons";
import { type S3Config } from "utils/s3/types";

type NavigationProps = {
  canGoBack: boolean;
  canGoForward: boolean;
  config?: S3Config;
  currentPrefix: string;
  onGoBack: () => void;
  onGoForward: () => void;
  onGoUp: () => void;
  onNavigate: (prefix: string) => void;
  onNewFile: () => void;
  onNewFolder: () => void;
  onOpenSettings: () => void;
  onRefresh: () => void;
  onSearchChange: (query: string) => void;
  onToggleView: () => void;
  onUploadClick: () => void;
  searchQuery: string;
  viewMode: "grid" | "details";
};

const Navigation: FC<NavigationProps> = ({
  canGoBack,
  canGoForward,
  config,
  currentPrefix,
  onGoBack,
  onGoForward,
  onGoUp,
  onNavigate,
  onNewFile,
  onNewFolder,
  onOpenSettings,
  onRefresh,
  onSearchChange,
  onToggleView,
  onUploadClick,
  searchQuery,
  viewMode,
}) => {
  const addressInputRef = useRef<HTMLInputElement | null>(null);

  const displayAddress = config
    ? `s3://${config.bucket}/${currentPrefix}`
    : "s3://[not-connected]/";

  const handleAddressSubmit = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Enter" && config) {
      let val = addressInputRef.current?.value.trim() || "";
      // Strip s3://bucket/ prefix if present
      const bucketPrefix = `s3://${config.bucket}/`;
      if (val.startsWith(bucketPrefix)) {
        val = val.slice(bucketPrefix.length);
      } else if (val.startsWith("s3://")) {
        val = val.slice(5);
        const slashIdx = val.indexOf("/");
        if (slashIdx !== -1) {
          val = val.slice(slashIdx + 1);
        } else {
          val = "";
        }
      }
      onNavigate(val);
    }
  };

  return (
    <>
      <StyledS3Toolbar>
        <button
          className="nav-btn"
          disabled={!canGoBack}
          onClick={onGoBack}
          title="Back"
          type="button"
        >
          <BackIcon />
        </button>
        <button
          className="nav-btn"
          disabled={!canGoForward}
          onClick={onGoForward}
          title="Forward"
          type="button"
        >
          <ForwardIcon />
        </button>
        <button
          className="nav-btn"
          disabled={!currentPrefix}
          onClick={onGoUp}
          title="Up one level"
          type="button"
        >
          <UpIcon />
        </button>
        <button
          className="nav-btn"
          onClick={onRefresh}
          title="Refresh"
          type="button"
        >
          <RefreshIcon />
        </button>

        <div className="divider" />

        <button
          className="action-btn primary"
          onClick={onUploadClick}
          title="Upload files to AWS S3"
          type="button"
        >
          <UploadIcon />
          <span>Upload</span>
        </button>

        <button
          className="action-btn"
          onClick={onNewFile}
          title="Create and edit a new code file"
          type="button"
        >
          <FilePlusIcon />
          <span>New File</span>
        </button>

        <button
          className="action-btn"
          onClick={onNewFolder}
          title="Create a new folder"
          type="button"
        >
          <FolderPlusIcon />
          <span>New Folder</span>
        </button>

        <div style={{ flex: 1 }} />

        <button
          className="action-btn"
          onClick={onToggleView}
          title={`Switch to ${viewMode === "grid" ? "Details" : "Icons"} view`}
          type="button"
        >
          {viewMode === "grid" ? <ListViewIcon /> : <GridViewIcon />}
          <span>{viewMode === "grid" ? "Details" : "Icons"}</span>
        </button>

        <button
          className="action-btn"
          onClick={onOpenSettings}
          style={{
            borderColor: config
              ? "rgba(0, 180, 100, 0.5)"
              : "rgba(255, 153, 0, 0.5)",
          }}
          title="Configure AWS S3 Credentials and Bucket"
          type="button"
        >
          <AwsIcon />
          <span>{config ? config.bucket : "Connect AWS S3"}</span>
        </button>
      </StyledS3Toolbar>

      <StyledS3AddressBarContainer>
        <div className="address-box">
          <span className="s3-icon">☁</span>
          <input
            key={displayAddress}
            defaultValue={displayAddress}
            ref={addressInputRef}
            onKeyDown={handleAddressSubmit}
            placeholder="s3://bucket-name/folder..."
          />
        </div>
        <div className="search-box">
          <input
            placeholder="Filter files..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </StyledS3AddressBarContainer>
    </>
  );
};

export default Navigation;
