import { StyledS3StatusBar } from "components/apps/S3FileManager/StyledS3FileManager";
import { type S3Config, type S3Item } from "utils/s3/types";

type StatusBarProps = {
  config?: S3Config;
  filesCount: number;
  foldersCount: number;
  loading: boolean;
  selectedItem?: S3Item;
  totalSizeBytes: number;
};

const formatSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const StatusBar: FC<StatusBarProps> = ({
  config,
  filesCount,
  foldersCount,
  loading,
  selectedItem,
  totalSizeBytes,
}) => {
  return (
    <StyledS3StatusBar>
      <div className="status-left">
        {loading ? (
          <span>Loading S3 objects...</span>
        ) : selectedItem ? (
          <span>
            Selected: {selectedItem.name} (
            {selectedItem.isFolder ? "Folder" : formatSize(selectedItem.size)})
          </span>
        ) : (
          <span>
            {foldersCount + filesCount} items ({foldersCount} folders,{" "}
            {filesCount} files) | Total: {formatSize(totalSizeBytes)}
          </span>
        )}
      </div>
      <div className="status-right">
        {config ? (
          <span>
            Region: {config.region} | S3: Connected ({config.bucket})
          </span>
        ) : (
          <span style={{ color: "rgb(255 180 80)" }}>S3: Not connected</span>
        )}
      </div>
    </StyledS3StatusBar>
  );
};

export default StatusBar;
