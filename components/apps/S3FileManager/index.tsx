import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ConnectionModal from "components/apps/S3FileManager/ConnectionModal";
import Navigation from "components/apps/S3FileManager/Navigation";
import NewFileDialog from "components/apps/S3FileManager/NewFileDialog";
import NewFolderDialog from "components/apps/S3FileManager/NewFolderDialog";
import S3FileGrid from "components/apps/S3FileManager/S3FileGrid";
import StatusBar from "components/apps/S3FileManager/StatusBar";
import {
  StyledS3Content,
  StyledS3FileManager,
} from "components/apps/S3FileManager/StyledS3FileManager";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";
import { useFileSystemActions } from "contexts/fileSystem";
import { useProcessesActions } from "contexts/process";
import { DESKTOP_PATH } from "utils/constants";
import { bufferToBlob } from "utils/functions";
import {
  clearStoredS3Config,
  createS3Folder,
  deleteS3Object,
  deleteS3Prefix,
  getS3ObjectData,
  getS3PresignedUrl,
  getStoredS3Config,
  listS3Objects,
  putS3Object,
  saveStoredS3Config,
} from "utils/s3/service";
import { type S3Config, type S3Item } from "utils/s3/types";

const S3FileManager: FC<ComponentProcessProps> = ({ id }) => {
  const { title, open } = useProcessesActions();
  const { writeFile, updateFolder, mkdirRecursive } = useFileSystemActions();

  const [config, setConfig] = useState<S3Config | undefined>(getStoredS3Config);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNewFileOpen, setIsNewFileOpen] = useState(false);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);

  const [history, setHistory] = useState<string[]>([""]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const currentPrefix = history[historyIndex] || "";

  const [items, setItems] = useState<S3Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<S3Item | undefined>();
  const [viewMode, setViewMode] = useState<"details" | "grid">("details");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Set window title
  useEffect(() => {
    if (config?.bucket) {
      title(
        id,
        currentPrefix
          ? `${currentPrefix} - s3://${config.bucket}`
          : `AWS S3 - ${config.bucket}`
      );
    } else {
      title(id, "AWS S3 File Manager");
    }
  }, [config, currentPrefix, id, title]);

  // Load items from S3
  const loadItems = useCallback(async () => {
    if (!config?.bucket) {
      setItems([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await listS3Objects(config, currentPrefix);
      setItems([...res.folders, ...res.files]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load S3 objects.";
      setError(message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [config, currentPrefix]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Navigation handlers
  const navigateTo = (newPrefix: string): void => {
    let clean = newPrefix.trim();
    if (clean.startsWith("/")) clean = clean.slice(1);
    if (clean && !clean.endsWith("/")) clean = `${clean}/`;

    if (clean === currentPrefix) return;

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(clean);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSelectedItem(undefined);
    setSearchQuery("");
  };

  const goBack = (): void => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSelectedItem(undefined);
    }
  };

  const goForward = (): void => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSelectedItem(undefined);
    }
  };

  const goUp = (): void => {
    if (!currentPrefix) return;
    const parts = currentPrefix.replace(/\/$/, "").split("/");
    parts.pop();
    const upPrefix = parts.length > 0 ? `${parts.join("/")}/` : "";
    navigateTo(upPrefix);
  };

  // Upload handlers
  const handleUploadFiles = async (files: File[] | FileList): Promise<void> => {
    if (!config) {
      setIsSettingsOpen(true);
      return;
    }

    setLoading(true);
    try {
      for (const file of Array.from(files)) {
        const key = `${currentPrefix}${file.name}`;
        await putS3Object(config, key, file, file.type);
      }
      await loadItems();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(`Upload error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  // Edit in Monaco Editor
  const handleEditFile = async (item: S3Item): Promise<void> => {
    if (!config) return;
    try {
      setLoading(true);
      const { buffer } = await getS3ObjectData(config, item.key);
      const localDir = `/Users/Public/AWS S3/${item.key.includes("/") ? item.key.slice(0, item.key.lastIndexOf("/")) : ""}`;
      const localPath = `/Users/Public/AWS S3/${item.key}`;

      await mkdirRecursive(localDir);
      await writeFile(localPath, buffer, true);
      updateFolder(localDir, item.name);

      // Open in Monaco Editor
      open("MonacoEditor", { url: localPath });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(`Could not open file: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  // Save to OS Desktop
  const handleSaveToDesktop = async (item: S3Item): Promise<void> => {
    if (!config) return;
    try {
      setLoading(true);
      const { buffer } = await getS3ObjectData(config, item.key);
      const desktopPath = `${DESKTOP_PATH}/${item.name}`;
      await writeFile(desktopPath, buffer, true);
      updateFolder(DESKTOP_PATH, item.name);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(`Error saving to Desktop: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  // Download directly to local computer
  const handleDownloadFile = async (item: S3Item): Promise<void> => {
    if (!config) return;
    try {
      const { buffer, contentType } = await getS3ObjectData(config, item.key);
      const blob = bufferToBlob(buffer, contentType);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = item.name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(`Download error: ${message}`);
    }
  };

  // Copy Presigned Share URL
  const handleCopyPresignedUrl = async (item: S3Item): Promise<void> => {
    if (!config) return;
    try {
      const presigned = await getS3PresignedUrl(config, item.key, 3600);
      await navigator.clipboard.writeText(presigned);
      alert(
        `✓ Presigned URL for "${item.name}" copied to clipboard! (Expires in 1 hour)`
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(`Error generating share link: ${message}`);
    }
  };

  // Copy S3 URI
  const handleCopyS3Uri = (item: S3Item): void => {
    if (!config) return;
    const uri = `s3://${config.bucket}/${item.key}`;
    navigator.clipboard.writeText(uri);
    alert(`✓ Copied: ${uri}`);
  };

  // Delete item
  const handleDelete = async (item: S3Item): Promise<void> => {
    if (!config) return;
    const confirmed = confirm(
      `Are you sure you want to delete ${item.isFolder ? `folder "${item.name}" and all its contents` : `file "${item.name}"`}?`
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      if (item.isFolder) {
        await deleteS3Prefix(config, item.key);
      } else {
        await deleteS3Object(config, item.key);
      }
      await loadItems();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(`Delete error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  // Create new file
  const handleCreateFile = async (fileName: string): Promise<void> => {
    if (!config) return;
    const key = `${currentPrefix}${fileName}`;
    try {
      await putS3Object(config, key, Buffer.from(""));
      await loadItems();
      await handleEditFile({
        isFolder: false,
        key,
        name: fileName,
        size: 0,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(`Error creating file: ${message}`);
    }
  };

  // Create new folder
  const handleCreateFolder = async (folderName: string): Promise<void> => {
    if (!config) return;
    const folderKey = `${currentPrefix}${folderName}/`;
    try {
      await createS3Folder(config, folderKey);
      await loadItems();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(`Error creating folder: ${message}`);
    }
  };

  // Config handlers
  const handleSaveConfig = (newConfig: S3Config): void => {
    saveStoredS3Config(newConfig);
    setConfig(newConfig);
    setHistory([""]);
    setHistoryIndex(0);
  };

  const handleDisconnect = (): void => {
    clearStoredS3Config();
    setConfig(undefined);
    setItems([]);
    setIsSettingsOpen(false);
  };

  // Filtered items
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((i) => i.name.toLowerCase().includes(q));
  }, [items, searchQuery]);

  const { filesCount, foldersCount, totalSizeBytes } = useMemo(() => {
    let files = 0;
    let folders = 0;
    let bytes = 0;
    items.forEach((i) => {
      if (i.isFolder) folders += 1;
      else {
        files += 1;
        bytes += i.size;
      }
    });
    return { filesCount: files, foldersCount: folders, totalSizeBytes: bytes };
  }, [items]);

  return (
    <StyledS3FileManager>
      <input
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files) handleUploadFiles(e.target.files);
          e.target.value = "";
        }}
        multiple
        style={{ display: "none" }}
        type="file"
      />

      <Navigation
        canGoBack={historyIndex > 0}
        canGoForward={historyIndex < history.length - 1}
        config={config}
        currentPrefix={currentPrefix}
        onGoBack={goBack}
        onGoForward={goForward}
        onGoUp={goUp}
        onNavigate={navigateTo}
        onNewFile={() => setIsNewFileOpen(true)}
        onNewFolder={() => setIsNewFolderOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRefresh={loadItems}
        onSearchChange={setSearchQuery}
        onToggleView={() =>
          setViewMode((m) => (m === "grid" ? "details" : "grid"))
        }
        onUploadClick={() => fileInputRef.current?.click()}
        searchQuery={searchQuery}
        viewMode={viewMode}
      />

      <StyledS3Content>
        {!config ? (
          <div
            style={{
              alignItems: "center",
              color: "#aaa",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "center",
              padding: 24,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>☁️</div>
            <h2 style={{ color: "#fff", fontSize: 18, margin: "0 0 8px" }}>
              AWS S3 File Manager
            </h2>
            <p style={{ fontSize: 13, margin: "0 0 16px", maxWidth: 360 }}>
              Connect your AWS account to browse, upload code, edit files, and
              manage your S3 buckets right inside this desktop.
            </p>
            <button
              onClick={() => setIsSettingsOpen(true)}
              style={{
                background: "#0078d4",
                border: "none",
                borderRadius: 4,
                color: "#fff",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                padding: "8px 20px",
              }}
              type="button"
            >
              Connect to AWS S3
            </button>
          </div>
        ) : error ? (
          <div
            style={{
              alignItems: "center",
              color: "#ff6b6b",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "center",
              padding: 20,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
            <div style={{ fontSize: 14, marginBottom: 12 }}>{error}</div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              style={{
                background: "#333",
                border: "1px solid #555",
                borderRadius: 4,
                color: "#fff",
                cursor: "pointer",
                fontSize: 12,
                padding: "6px 14px",
              }}
              type="button"
            >
              Check AWS Settings
            </button>
          </div>
        ) : filteredItems.length === 0 && !loading ? (
          <div
            style={{
              alignItems: "center",
              color: "#777",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 6 }}>📁</div>
            <div>This folder is empty</div>
            <div style={{ fontSize: 11, marginTop: 4 }}>
              Drag and drop files here to upload to S3
            </div>
          </div>
        ) : (
          <S3FileGrid
            items={filteredItems}
            onCopyPresignedUrl={handleCopyPresignedUrl}
            onCopyS3Uri={handleCopyS3Uri}
            onDelete={handleDelete}
            onDownloadFile={handleDownloadFile}
            onEditFile={handleEditFile}
            onNavigate={navigateTo}
            onNewFile={() => setIsNewFileOpen(true)}
            onNewFolder={() => setIsNewFolderOpen(true)}
            onRefresh={loadItems}
            onSaveToDesktop={handleSaveToDesktop}
            onSelect={setSelectedItem}
            onUploadClick={() => fileInputRef.current?.click()}
            onUploadFiles={handleUploadFiles}
            selectedItem={selectedItem}
            viewMode={viewMode}
          />
        )}
      </StyledS3Content>

      <StatusBar
        config={config}
        filesCount={filesCount}
        foldersCount={foldersCount}
        loading={loading}
        selectedItem={selectedItem}
        totalSizeBytes={totalSizeBytes}
      />

      <ConnectionModal
        currentConfig={config}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onDisconnect={handleDisconnect}
        onSave={handleSaveConfig}
      />

      <NewFileDialog
        isOpen={isNewFileOpen}
        onClose={() => setIsNewFileOpen(false)}
        onCreate={handleCreateFile}
      />

      <NewFolderDialog
        isOpen={isNewFolderOpen}
        onClose={() => setIsNewFolderOpen(false)}
        onCreate={handleCreateFolder}
      />
    </StyledS3FileManager>
  );
};

export default S3FileManager;
