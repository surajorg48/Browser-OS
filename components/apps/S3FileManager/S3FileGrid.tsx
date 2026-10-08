import {
  StyledS3FileGrid,
  StyledS3Item,
  StyledS3ItemRow,
} from "components/apps/S3FileManager/StyledS3FileManager";
import { type S3Item } from "utils/s3/types";
import { useMenuActions } from "contexts/menu";
import { type CaptureTriggerEvent } from "contexts/menu/useMenuContextState";
import { MENU_SEPERATOR } from "utils/constants";

export const CODE_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
  ".json",
  ".html",
  ".htm",
  ".css",
  ".scss",
  ".less",
  ".py",
  ".env",
  ".yml",
  ".yaml",
  ".xml",
  ".sql",
  ".sh",
  ".bash",
  ".zsh",
  ".cmd",
  ".bat",
  ".ps1",
  ".php",
  ".conf",
  ".ini",
  ".md",
  ".markdown",
  ".dockerfile",
  ".rs",
  ".go",
  ".c",
  ".cpp",
  ".h",
  ".java",
  ".kt",
  ".rb",
  ".txt",
]);

export const IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".bmp",
  ".ico",
]);

export const AUDIO_EXTENSIONS = new Set([
  ".mp3",
  ".wav",
  ".ogg",
  ".flac",
  ".m4a",
  ".aac",
]);

export const VIDEO_EXTENSIONS = new Set([
  ".mp4",
  ".webm",
  ".mkv",
  ".avi",
  ".mov",
]);

export const ARCHIVE_EXTENSIONS = new Set([
  ".zip",
  ".tar",
  ".gz",
  ".7z",
  ".rar",
  ".iso",
]);

export const getS3ItemIcon = (item: S3Item): string => {
  if (item.isFolder) return "/System/Icons/folder.webp";
  const ext = "." + item.name.split(".").pop()?.toLowerCase() || "";
  if (CODE_EXTENSIONS.has(ext)) return "/System/Icons/monaco.webp";
  if (IMAGE_EXTENSIONS.has(ext)) return "/System/Icons/image.webp";
  if (AUDIO_EXTENSIONS.has(ext)) return "/System/Icons/audio.webp";
  if (VIDEO_EXTENSIONS.has(ext)) return "/System/Icons/vlc.webp";
  if (ARCHIVE_EXTENSIONS.has(ext)) return "/System/Icons/compressed.webp";
  if (ext === ".pdf") return "/System/Icons/pdf.webp";
  if (ext === ".txt") return "/System/Icons/documents.webp";
  return "/System/Icons/unknown.webp";
};

const formatSize = (bytes: number): string => {
  if (bytes === 0) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const formatDate = (date?: string | Date): string => {
  if (!date) return "-";
  try {
    const d = new Date(date);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
};

type S3FileGridProps = {
  items: S3Item[];
  onCopyPresignedUrl: (item: S3Item) => void;
  onCopyS3Uri: (item: S3Item) => void;
  onDelete: (item: S3Item) => void;
  onDownloadFile: (item: S3Item) => void;
  onEditFile: (item: S3Item) => void;
  onNavigate: (prefix: string) => void;
  onNewFile: () => void;
  onNewFolder: () => void;
  onRefresh: () => void;
  onSaveToDesktop: (item: S3Item) => void;
  onSelect: (item?: S3Item) => void;
  onUploadClick: () => void;
  onUploadFiles: (files: FileList | File[]) => void;
  selectedItem?: S3Item;
  viewMode: "grid" | "details";
};

const S3FileGrid: FC<S3FileGridProps> = ({
  items,
  onCopyPresignedUrl,
  onCopyS3Uri,
  onDelete,
  onDownloadFile,
  onEditFile,
  onNavigate,
  onNewFile,
  onNewFolder,
  onRefresh,
  onSaveToDesktop,
  onSelect,
  onUploadClick,
  onUploadFiles,
  selectedItem,
  viewMode,
}) => {
  const { contextMenu } = useMenuActions();

  const handleDoubleClick = (item: S3Item): void => {
    if (item.isFolder) {
      onNavigate(item.key);
    } else {
      const ext = "." + item.name.split(".").pop()?.toLowerCase() || "";
      if (CODE_EXTENSIONS.has(ext)) {
        onEditFile(item);
      } else {
        onDownloadFile(item);
      }
    }
  };

  const getItemContextMenu = (item: S3Item) => {
    if (item.isFolder) {
      return [
        {
          action: () => onNavigate(item.key),
          label: "Open Folder",
        },
        MENU_SEPERATOR,
        {
          action: () => onCopyS3Uri(item),
          label: "Copy S3 URI",
        },
        MENU_SEPERATOR,
        {
          action: () => onDelete(item),
          label: "Delete Folder",
        },
      ];
    }

    const ext = "." + item.name.split(".").pop()?.toLowerCase() || "";
    const isCode = CODE_EXTENSIONS.has(ext);

    return [
      ...(isCode
        ? [
            {
              action: () => onEditFile(item),
              icon: "/System/Icons/monaco.webp",
              label: "Edit in Monaco Editor",
            },
            MENU_SEPERATOR,
          ]
        : []),
      {
        action: () => onDownloadFile(item),
        label: "Download to Computer",
      },
      {
        action: () => onSaveToDesktop(item),
        label: "Save to OS Desktop",
      },
      MENU_SEPERATOR,
      {
        action: () => onCopyPresignedUrl(item),
        label: "Copy Presigned Share URL (1h)",
      },
      {
        action: () => onCopyS3Uri(item),
        label: "Copy S3 URI",
      },
      MENU_SEPERATOR,
      {
        action: () => onDelete(item),
        label: "Delete",
      },
    ];
  };

  const getEmptyAreaContextMenu = () => [
    {
      action: onUploadClick,
      icon: "/System/Icons/copying.webp",
      label: "Upload File(s)...",
    },
    {
      action: onNewFile,
      icon: "/System/Icons/monaco.webp",
      label: "New Code File...",
    },
    {
      action: onNewFolder,
      icon: "/System/Icons/new_folder.webp",
      label: "New Folder...",
    },
    MENU_SEPERATOR,
    {
      action: onRefresh,
      label: "Refresh",
    },
  ];

  const emptyAreaContext = contextMenu(() => getEmptyAreaContextMenu());

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUploadFiles(e.dataTransfer.files);
    }
  };

  return (
    <StyledS3FileGrid
      className={viewMode}
      onContextMenuCapture={emptyAreaContext.onContextMenuCapture}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => onSelect(undefined)}
    >
      {items.map((item) => {
        const isSelected = selectedItem?.key === item.key;
        const iconSrc = getS3ItemIcon(item);
        const itemContext = contextMenu(() => getItemContextMenu(item));

        if (viewMode === "details") {
          return (
            <StyledS3ItemRow
              key={item.key}
              $isSelected={isSelected}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(item);
              }}
              onContextMenuCapture={(e) => {
                e.stopPropagation();
                onSelect(item);
                itemContext.onContextMenuCapture(e);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                handleDoubleClick(item);
              }}
            >
              <div className="col-icon">
                <img alt={item.name} src={iconSrc} />
              </div>
              <div className="col-name" title={item.name}>
                {item.name}
              </div>
              <div className="col-size">{formatSize(item.size)}</div>
              <div className="col-date">{formatDate(item.lastModified)}</div>
            </StyledS3ItemRow>
          );
        }

        return (
          <StyledS3Item
            key={item.key}
            $isSelected={isSelected}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item);
            }}
            onContextMenuCapture={(e) => {
              e.stopPropagation();
              onSelect(item);
              itemContext.onContextMenuCapture(e);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              handleDoubleClick(item);
            }}
          >
            <picture>
              <img alt={item.name} src={iconSrc} />
            </picture>
            <span className="label" title={item.name}>
              {item.name}
            </span>
          </StyledS3Item>
        );
      })}
    </StyledS3FileGrid>
  );
};

export default S3FileGrid;
