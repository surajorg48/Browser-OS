import { useState } from "react";
import {
  StyledModalDialog,
  StyledModalOverlay,
} from "components/apps/S3FileManager/StyledS3FileManager";
import { type S3Config } from "utils/s3/types";
import { testS3Connection } from "utils/s3/service";

const AWS_REGIONS = [
  { id: "ap-south-1", name: "Asia Pacific (Mumbai) [ap-south-1]" },
  { id: "us-east-1", name: "US East (N. Virginia) [us-east-1]" },
  { id: "us-west-2", name: "US West (Oregon) [us-west-2]" },
  { id: "eu-west-1", name: "Europe (Ireland) [eu-west-1]" },
  { id: "ap-southeast-1", name: "Asia Pacific (Singapore) [ap-southeast-1]" },
  { id: "eu-central-1", name: "Europe (Frankfurt) [eu-central-1]" },
];

type ConnectionModalProps = {
  currentConfig?: S3Config;
  isOpen: boolean;
  onClose: () => void;
  onDisconnect: () => void;
  onSave: (config: S3Config) => void;
};

const ConnectionModal: FC<ConnectionModalProps> = ({
  currentConfig,
  isOpen,
  onClose,
  onDisconnect,
  onSave,
}) => {
  const [accessKeyId, setAccessKeyId] = useState(
    currentConfig?.accessKeyId || ""
  );
  const [secretAccessKey, setSecretAccessKey] = useState(
    currentConfig?.secretAccessKey || ""
  );
  const [region, setRegion] = useState(currentConfig?.region || "ap-south-1");
  const [bucket, setBucket] = useState(currentConfig?.bucket || "");
  const [endpoint, setEndpoint] = useState(currentConfig?.endpoint || "");
  const [sessionToken, setSessionToken] = useState(
    currentConfig?.sessionToken || ""
  );

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    message: string;
    success: boolean;
  } | null>(null);

  if (!isOpen) return null;

  const handleTest = async (): Promise<void> => {
    if (!accessKeyId || !secretAccessKey || !bucket) {
      setTestResult({
        message: "Please enter Access Key, Secret Key, and Bucket name.",
        success: false,
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    const configToTest: S3Config = {
      accessKeyId,
      bucket,
      endpoint: endpoint || undefined,
      region,
      secretAccessKey,
      sessionToken: sessionToken || undefined,
    };

    const res = await testS3Connection(configToTest);
    setTesting(false);
    if (res.success) {
      setTestResult({
        message: "✓ Successfully connected to AWS S3 bucket!",
        success: true,
      });
    } else {
      setTestResult({
        message: `✕ Connection failed: ${res.message || "Unknown error"}`,
        success: false,
      });
    }
  };

  const handleSave = (): void => {
    if (!accessKeyId || !secretAccessKey || !bucket) {
      setTestResult({
        message: "Access Key, Secret Key, and Bucket are required.",
        success: false,
      });
      return;
    }

    onSave({
      accessKeyId,
      bucket,
      endpoint: endpoint || undefined,
      region,
      secretAccessKey,
      sessionToken: sessionToken || undefined,
    });
    onClose();
  };

  return (
    <StyledModalOverlay onClick={onClose}>
      <StyledModalDialog onClick={(e) => e.stopPropagation()}>
        <h3>Connect AWS S3 Account</h3>

        <div className="form-group">
          <label>AWS Access Key ID *</label>
          <input
            placeholder="AKIA..."
            type="text"
            value={accessKeyId}
            onChange={(e) => setAccessKeyId(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>AWS Secret Access Key *</label>
          <input
            placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
            type="password"
            value={secretAccessKey}
            onChange={(e) => setSecretAccessKey(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>AWS Region *</label>
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            {AWS_REGIONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>S3 Bucket Name *</label>
          <input
            placeholder="my-app-uploads"
            type="text"
            value={bucket}
            onChange={(e) => setBucket(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Custom Endpoint (Optional for Cloudflare R2 / MinIO)</label>
          <input
            placeholder="https://..."
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>AWS Session Token (Optional)</label>
          <input
            placeholder="Optional STS Token"
            type="password"
            value={sessionToken}
            onChange={(e) => setSessionToken(e.target.value)}
          />
        </div>

        {testResult && (
          <div
            style={{
              color: testResult.success ? "#4caf50" : "#ff5252",
              fontSize: "12px",
              marginTop: "4px",
            }}
          >
            {testResult.message}
          </div>
        )}

        <div style={{ color: "#888", fontSize: "11px", marginTop: "10px" }}>
          🔒 Note: Credentials are saved locally in your browser storage only.
          They are never sent to external servers or committed to git.
        </div>

        <div className="modal-actions">
          {currentConfig && (
            <button className="btn-danger" onClick={onDisconnect} type="button">
              Disconnect
            </button>
          )}
          <button
            className="btn-secondary"
            disabled={testing}
            onClick={handleTest}
            type="button"
          >
            {testing ? "Testing..." : "Test Connection"}
          </button>
          <button className="btn-secondary" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave} type="button">
            Save & Connect
          </button>
        </div>
      </StyledModalDialog>
    </StyledModalOverlay>
  );
};

export default ConnectionModal;
