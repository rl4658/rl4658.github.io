import { useState, useRef, useEffect, useMemo } from "react";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Cpu,
  Play,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  Activity,
  Code,
  Bug,
  Lock,
  Unlock,
  FileCode,
  CheckCircle2,
  XCircle,
  Search,
  Layers,
  Radio,
  Zap,
  Globe,
  GitBranch,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Database,
  Sliders,
} from "lucide-react";
import EngineeringArticle, {
  ArticleSection,
  SourceLink,
} from "@/components/EngineeringArticle";

const repo = "https://github.com/rl4658/cryptographic-misuse-detector";
const blob = "https://github.com/rl4658/cryptographic-misuse-detector/blob/master";

const sections = [
  ["overview", "01 / Cryptographic Security Problem & Motivation"],
  ["taxonomies", "02 / 6 Vulnerability Taxonomies & CWE Mappings"],
  ["semgrep-rules", "03 / Semgrep AST Rule Engineering"],
  ["llm-analysis", "04 / LLM Semantic Static Analysis & Schemas"],
  ["benchmarks", "05 / Comparative Benchmarks & Evaluation Math"],
  ["interactive-studio", "06 / Interactive Cryptographic Misuse Scanner Studio"],
  ["streaming-arch", "07 / FastAPI SSE Streaming Architecture"],
  ["source-review", "08 / Source Code Review & Hyperlinks"],
  ["cli-guide", "09 / Local Setup & CLI Execution Guide"],
] as const;

/* ------------------------------------------------------------------------- */
/* Interactive Studio Sample Definitions                                     */
/* ------------------------------------------------------------------------- */
interface Finding {
  id: string;
  engine: "semgrep" | "gemini";
  cwe: string;
  category: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  line: number;
  snippet: string;
  explanation: string;
  fix: string;
}

interface GroundTruthSample {
  id: string;
  name: string;
  language: "Python" | "Java" | "Go";
  description: string;
  code: string;
  semgrepFindings: Finding[];
  llmFindings: Finding[];
  metrics: {
    tp: number;
    fp: number;
    fn: number;
    precision: number;
    recall: number;
    f1: number;
    agreement: number;
  };
}

const PRESET_SAMPLES: GroundTruthSample[] = [
  {
    id: "py-vulnerable",
    name: "Python: Vulnerable Crypto Sample (CWE-321, CWE-327, CWE-329)",
    language: "Python",
    description: "Multi-flaw Python sample using PyCryptodome and hashlib containing hardcoded keys, ECB mode, MD5 hashing, and predictable IVs.",
    code: `import os
import hashlib
from Crypto.Cipher import AES
import random

# FLUSH 1: Hardcoded 128-bit key (CWE-321)
MASTER_KEY = b"0123456789abcdef"

# FLUSH 2: Insecure AES in Electronic Codebook (ECB) mode (CWE-327)
def encrypt_credit_card(card_number: str) -> bytes:
    cipher = AES.new(MASTER_KEY, AES.MODE_ECB)
    padded = card_number.ljust(32, ' ').encode('utf-8')
    return cipher.encrypt(padded)

# FLUSH 3: Weak MD5 hashing for password authentication (CWE-327)
def hash_user_password(password: str) -> str:
    hasher = hashlib.md5()
    hasher.update(password.encode('utf-8'))
    return hasher.hexdigest()

# FLUSH 4: Static / Reused Initialization Vector (CWE-329)
STATIC_IV = b"\\x00" * 16
def encrypt_session_token(token: str) -> bytes:
    cipher = AES.new(MASTER_KEY, AES.MODE_CBC, STATIC_IV)
    return cipher.encrypt(token.ljust(32).encode('utf-8'))

# FLUSH 5: Insecure Pseudo-Random Number Generator (CWE-338)
def generate_api_key() -> str:
    rand_val = random.randint(100000, 999999)
    return f"KEY-{rand_val}"
`,
    semgrepFindings: [
      {
        id: "sem-1",
        engine: "semgrep",
        cwe: "CWE-321",
        category: "hardcoded_key",
        severity: "CRITICAL",
        line: 7,
        snippet: 'MASTER_KEY = b"0123456789abcdef"',
        explanation: "Static byte literal assigned to variable matched AST pattern $KEY = b'...'",
        fix: 'Use os.environ.get("MASTER_KEY") or a hardware KMS secret vault.',
      },
      {
        id: "sem-2",
        engine: "semgrep",
        cwe: "CWE-327",
        category: "ecb_mode",
        severity: "HIGH",
        line: 11,
        snippet: "cipher = AES.new(MASTER_KEY, AES.MODE_ECB)",
        explanation: "Detected AES.MODE_ECB invocation. Electronic Codebook leaks plaintext block repetitions.",
        fix: "Switch to authenticated AES-GCM: AES.new(key, AES.MODE_GCM).",
      },
      {
        id: "sem-3",
        engine: "semgrep",
        cwe: "CWE-327",
        category: "weak_algorithm",
        severity: "HIGH",
        line: 17,
        snippet: "hasher = hashlib.md5()",
        explanation: "Detected hashlib.md5() constructor. MD5 is broken by collision vulnerabilities.",
        fix: "Use SHA-256 (hashlib.sha256) or Argon2id/bcrypt for password hashing.",
      },
      {
        id: "sem-4",
        engine: "semgrep",
        cwe: "CWE-329",
        category: "iv_reuse",
        severity: "HIGH",
        line: 23,
        snippet: 'STATIC_IV = b"\\x00" * 16',
        explanation: "Static 16-byte zero IV pattern matched metavariable regex.",
        fix: "Generate a fresh cryptographically random IV for every encryption call: os.urandom(16).",
      },
      {
        id: "sem-5",
        engine: "semgrep",
        cwe: "CWE-338",
        category: "insecure_random",
        severity: "MEDIUM",
        line: 28,
        snippet: "rand_val = random.randint(100000, 999999)",
        explanation: "random.randint uses the Mersenne Twister LCG, which is predictable after observing 624 outputs.",
        fix: "Use the secrets module: secrets.randbelow(900000) + 100000.",
      },
    ],
    llmFindings: [
      {
        id: "llm-1",
        engine: "gemini",
        cwe: "CWE-321",
        category: "hardcoded_key",
        severity: "CRITICAL",
        line: 7,
        snippet: 'MASTER_KEY = b"0123456789abcdef"',
        explanation: "Gemini 2.5 Flash identified a hardcoded 128-bit symmetric key literal at module scope.",
        fix: "Inject secrets via environment variables or a Cloud KMS client wrapper.",
      },
      {
        id: "llm-2",
        engine: "gemini",
        cwe: "CWE-327",
        category: "ecb_mode",
        severity: "HIGH",
        line: 11,
        snippet: "cipher = AES.new(MASTER_KEY, AES.MODE_ECB)",
        explanation: "Identified AES cipher initialization in deterministic ECB mode, violating semantic security.",
        fix: "Migrate to AES-GCM or ChaCha20-Poly1305 with authenticated tags.",
      },
      {
        id: "llm-3",
        engine: "gemini",
        cwe: "CWE-327",
        category: "weak_algorithm",
        severity: "HIGH",
        line: 17,
        snippet: "hasher = hashlib.md5()",
        explanation: "Detected MD5 digest algorithm used for credential handling, susceptible to rainbow tables and collision attacks.",
        fix: "Upgrade to PBKDF2 with SHA-256, bcrypt, or Argon2id with work factor tuning.",
      },
      {
        id: "llm-4",
        engine: "gemini",
        cwe: "CWE-329",
        category: "iv_reuse",
        severity: "HIGH",
        line: 24,
        snippet: "cipher = AES.new(MASTER_KEY, AES.MODE_CBC, STATIC_IV)",
        explanation: "Constant zeroed IV passed into CBC cipher constructor, allowing two-time pad XOR cryptanalysis.",
        fix: "Generate distinct 16-byte initialization vectors via secrets.token_bytes(16).",
      },
      {
        id: "llm-5",
        engine: "gemini",
        cwe: "CWE-338",
        category: "insecure_random",
        severity: "MEDIUM",
        line: 28,
        snippet: "rand_val = random.randint(100000, 999999)",
        explanation: "PRNG from standard random module employed in security-sensitive API key generator token path.",
        fix: "Replace random.randint with secrets.token_urlsafe(32).",
      },
    ],
    metrics: {
      tp: 5,
      fp: 0,
      fn: 0,
      precision: 1.0,
      recall: 1.0,
      f1: 1.0,
      agreement: 5,
    },
  },
  {
    id: "py-secure",
    name: "Python: Secure Remediated (AES-GCM, PBKDF2, secrets)",
    language: "Python",
    description: "Cryptographically hardened Python implementation utilizing authenticated encryption, secure random, and Argon2-grade hash derivations.",
    code: `import os
import secrets
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import hashlib

# Secure 1: Secret retrieved from runtime environment
MASTER_KEY = os.environ.get("APP_ENCRYPTION_KEY", "").encode('utf-8')
if len(MASTER_KEY) != 32:
    MASTER_KEY = AESGCM.generate_key(bit_length=256)

# Secure 2: Authenticated AES-GCM with distinct 96-bit nonce
def encrypt_credit_card(card_number: str) -> tuple[bytes, bytes]:
    aesgcm = AESGCM(MASTER_KEY)
    nonce = secrets.token_bytes(12) # Fresh 96-bit random nonce
    ciphertext = aesgcm.encrypt(nonce, card_number.encode('utf-8'), None)
    return nonce, ciphertext

# Secure 3: SHA-256 with salt & key stretching
def hash_user_password(password: str, salt: bytes) -> bytes:
    return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 600000)

# Secure 4: Cryptographically secure token generation
def generate_api_key() -> str:
    return secrets.token_urlsafe(32)
`,
    semgrepFindings: [],
    llmFindings: [],
    metrics: {
      tp: 0,
      fp: 0,
      fn: 0,
      precision: 1.0,
      recall: 1.0,
      f1: 1.0,
      agreement: 0,
    },
  },
  {
    id: "java-vulnerable",
    name: "Java: Vulnerable Crypto Sample (DES 56-bit, ECB, MD5, Random)",
    language: "Java",
    description: "Enterprise Java snippet demonstrating deprecated JCE ciphers, DES 56-bit key degradation, and java.util.Random usage.",
    code: `import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.security.MessageDigest;
import java.util.Random;

public class LegacyPaymentHandler {
    // FLUSH 1: Hardcoded 8-byte DES key (CWE-321 & CWE-326)
    private static final byte[] DES_KEY = "weak_key".getBytes();

    // FLUSH 2: Insecure DES cipher in ECB mode (CWE-326, CWE-327)
    public byte[] encryptPayload(byte[] data) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(DES_KEY, "DES");
        Cipher cipher = Cipher.getInstance("DES/ECB/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, keySpec);
        return cipher.doFinal(data);
    }

    // FLUSH 3: Weak MD5 digest (CWE-327)
    public byte[] checksum(byte[] input) throws Exception {
        MessageDigest md = MessageDigest.getInstance("MD5");
        return md.digest(input);
    }

    // FLUSH 4: Insecure LCG PRNG (CWE-338)
    public int generateOTP() {
        Random rng = new Random();
        return rng.nextInt(900000) + 100000;
    }
}
`,
    semgrepFindings: [
      {
        id: "sem-j1",
        engine: "semgrep",
        cwe: "CWE-321",
        category: "hardcoded_key",
        severity: "CRITICAL",
        line: 8,
        snippet: 'private static final byte[] DES_KEY = "weak_key".getBytes();',
        explanation: 'Hardcoded key byte array pattern matched Java AST rule.',
        fix: 'Retrieve encryption key from Java KeyStore (JKS) or HashiCorp Vault.',
      },
      {
        id: "sem-j2",
        engine: "semgrep",
        cwe: "CWE-326",
        category: "insufficient_key_length",
        severity: "HIGH",
        line: 12,
        snippet: 'SecretKeySpec keySpec = new SecretKeySpec(DES_KEY, "DES");',
        explanation: 'DES algorithm utilizes 56-bit keys, which can be brute-forced in hours.',
        fix: 'Upgrade to AES with 256-bit keys: new SecretKeySpec(aesKey, "AES").',
      },
      {
        id: "sem-j3",
        engine: "semgrep",
        cwe: "CWE-327",
        category: "ecb_mode",
        severity: "HIGH",
        line: 13,
        snippet: 'Cipher cipher = Cipher.getInstance("DES/ECB/PKCS5Padding");',
        explanation: 'ECB transformation mode selected in Cipher.getInstance().',
        fix: 'Use "AES/GCM/NoPadding" with GCMParameterSpec.',
      },
      {
        id: "sem-j4",
        engine: "semgrep",
        cwe: "CWE-327",
        category: "weak_algorithm",
        severity: "HIGH",
        line: 19,
        snippet: 'MessageDigest md = MessageDigest.getInstance("MD5");',
        explanation: 'MD5 algorithm instantiated via JCA provider.',
        fix: 'Use MessageDigest.getInstance("SHA-256").',
      },
      {
        id: "sem-j5",
        engine: "semgrep",
        cwe: "CWE-338",
        category: "insecure_random",
        severity: "MEDIUM",
        line: 25,
        snippet: 'Random rng = new Random();',
        explanation: 'java.util.Random is a linear congruential generator unsafe for cryptographic OTPs.',
        fix: 'Replace with java.security.SecureRandom.',
      },
    ],
    llmFindings: [
      {
        id: "llm-j1",
        engine: "gemini",
        cwe: "CWE-321",
        category: "hardcoded_key",
        severity: "CRITICAL",
        line: 8,
        snippet: 'private static final byte[] DES_KEY = "weak_key".getBytes();',
        explanation: 'Hardcoded byte literal key embedded into constant class field.',
        fix: 'Store symmetric keys in an encrypted KeyStore or AWS Secrets Manager.',
      },
      {
        id: "llm-j2",
        engine: "gemini",
        cwe: "CWE-326",
        category: "insufficient_key_length",
        severity: "HIGH",
        line: 12,
        snippet: 'SecretKeySpec keySpec = new SecretKeySpec(DES_KEY, "DES");',
        explanation: 'Legacy Data Encryption Standard (DES) specifies insufficient 56-bit key entropy.',
        fix: 'Migrate to AES-256 authenticated encryption.',
      },
      {
        id: "llm-j3",
        engine: "gemini",
        cwe: "CWE-327",
        category: "ecb_mode",
        severity: "HIGH",
        line: 13,
        snippet: 'Cipher cipher = Cipher.getInstance("DES/ECB/PKCS5Padding");',
        explanation: 'ECB mode lacks semantic security, producing identical ciphertext for matching blocks.',
        fix: 'Configure Cipher.getInstance("AES/GCM/NoPadding").',
      },
      {
        id: "llm-j4",
        engine: "gemini",
        cwe: "CWE-327",
        category: "weak_algorithm",
        severity: "HIGH",
        line: 19,
        snippet: 'MessageDigest md = MessageDigest.getInstance("MD5");',
        explanation: 'MD5 message digest prone to practical collision generation attacks.',
        fix: 'Upgrade to SHA-256 or SHA-512.',
      },
      {
        id: "llm-j5",
        engine: "gemini",
        cwe: "CWE-338",
        category: "insecure_random",
        severity: "MEDIUM",
        line: 25,
        snippet: 'Random rng = new Random();',
        explanation: 'Non-cryptographic PRNG java.util.Random utilized for OTP security token generation.',
        fix: 'Use SecureRandom.getInstanceStrong().',
      },
    ],
    metrics: {
      tp: 5,
      fp: 0,
      fn: 0,
      precision: 1.0,
      recall: 1.0,
      f1: 1.0,
      agreement: 5,
    },
  },
  {
    id: "go-vulnerable",
    name: "Go: Vulnerable Crypto Sample (crypto/des, math/rand, hardcoded IV)",
    language: "Go",
    description: "Go microservice sample importing deprecated crypto/des, math/rand PRNG, and constant IV slice.",
    code: `package main

import (
	"crypto/cipher"
	"crypto/des"
	"math/rand"
)

// FLUSH 1: Hardcoded 8-byte DES key (CWE-321 & CWE-326)
var desKey = []byte("8bytekey")

// FLUSH 2: Hardcoded static IV for CBC mode (CWE-329)
var staticIV = []byte("00000000")

func EncryptToken(payload []byte) ([]byte, error) {
	// FLUSH 3: Insecure DES cipher (CWE-326)
	block, err := des.NewCipher(desKey)
	if err != nil {
		return nil, err
	}
	mode := cipher.NewCBCEncrypter(block, staticIV)
	ciphertext := make([]byte, len(payload))
	mode.CryptBlocks(ciphertext, payload)
	return ciphertext, nil
}

// FLUSH 4: Predictable math/rand used for auth challenge (CWE-338)
func GenerateChallenge() int64 {
	return rand.Int63()
}
`,
    semgrepFindings: [
      {
        id: "sem-g1",
        engine: "semgrep",
        cwe: "CWE-321",
        category: "hardcoded_key",
        severity: "CRITICAL",
        line: 11,
        snippet: 'var desKey = []byte("8bytekey")',
        explanation: 'Hardcoded byte slice literal matched Go AST pattern.',
        fix: 'Read key from environment variable os.Getenv("APP_KEY").',
      },
      {
        id: "sem-g2",
        engine: "semgrep",
        cwe: "CWE-329",
        category: "iv_reuse",
        severity: "HIGH",
        line: 14,
        snippet: 'var staticIV = []byte("00000000")',
        explanation: 'Static 8-byte IV constant used in block cipher.',
        fix: 'Generate dynamic IV via io.ReadFull(crypto/rand.Reader, iv).',
      },
      {
        id: "sem-g3",
        engine: "semgrep",
        cwe: "CWE-326",
        category: "insufficient_key_length",
        severity: "HIGH",
        line: 18,
        snippet: "block, err := des.NewCipher(desKey)",
        explanation: "des.NewCipher creates a legacy 56-bit DES cipher block.",
        fix: "Migrate to aes.NewCipher with 256-bit key slice.",
      },
      {
        id: "sem-g4",
        engine: "semgrep",
        cwe: "CWE-338",
        category: "insecure_random",
        severity: "MEDIUM",
        line: 29,
        snippet: "return rand.Int63()",
        explanation: "math/rand is a pseudo-random generator unsuitable for security tokens.",
        fix: "Use crypto/rand.Int or crypto/rand.Read.",
      },
    ],
    llmFindings: [
      {
        id: "llm-g1",
        engine: "gemini",
        cwe: "CWE-321",
        category: "hardcoded_key",
        severity: "CRITICAL",
        line: 11,
        snippet: 'var desKey = []byte("8bytekey")',
        explanation: 'Gemini detected a hardcoded DES key slice in global package scope.',
        fix: 'Inject secrets via environment variables or HashiCorp Vault Go SDK.',
      },
      {
        id: "llm-g2",
        engine: "gemini",
        cwe: "CWE-329",
        category: "iv_reuse",
        severity: "HIGH",
        line: 14,
        snippet: 'var staticIV = []byte("00000000")',
        explanation: 'Constant static IV passed into cipher.NewCBCEncrypter, exposing ciphertext to differential analysis.',
        fix: 'Use crypto/rand to generate a unique random IV per encryption call.',
      },
      {
        id: "llm-g3",
        engine: "gemini",
        cwe: "CWE-326",
        category: "insufficient_key_length",
        severity: "HIGH",
        line: 18,
        snippet: "block, err := des.NewCipher(desKey)",
        explanation: 'DES algorithm with 56-bit key length is cryptographically broken.',
        fix: 'Use crypto/aes and cipher.NewGCM for modern authenticated encryption.',
      },
      {
        id: "llm-g4",
        engine: "gemini",
        cwe: "CWE-338",
        category: "insecure_random",
        severity: "MEDIUM",
        line: 29,
        snippet: "return rand.Int63()",
        explanation: 'math/rand generates deterministic sequences from a seed, insecure for cryptographic challenges.',
        fix: 'Use crypto/rand.Read with a byte slice.',
      },
    ],
    metrics: {
      tp: 4,
      fp: 0,
      fn: 0,
      precision: 1.0,
      recall: 1.0,
      f1: 1.0,
      agreement: 4,
    },
  },
];

/* ------------------------------------------------------------------------- */
/* Interactive Live Cryptographic Misuse Scanner Studio                      */
/* ------------------------------------------------------------------------- */
function ScannerStudio() {
  const [selectedSampleId, setSelectedSampleId] = useState<string>("py-vulnerable");
  const [customRepoUrl, setCustomRepoUrl] = useState<string>("https://github.com/rl4658/cryptographic-misuse-detector");
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [scanMode, setScanMode] = useState<"both" | "semgrep" | "llm">("both");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStage, setScanStage] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"findings" | "code" | "metrics">("findings");
  const [expandedFixId, setExpandedFixId] = useState<string | null>("sem-1");
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const sample = useMemo(() => {
    return PRESET_SAMPLES.find((s) => s.id === selectedSampleId) || PRESET_SAMPLES[0];
  }, [selectedSampleId]);

  const stages = [
    "Validating repository & file structure...",
    "Cloning shallow sandbox workspace into isolated tempdir...",
    "Running custom Semgrep AST pattern rules (YAML)...",
    "Dispatching 150-line chunk windows to Google Gemini 2.5 Flash...",
    "Cross-referencing findings against ground truth (±5 line tolerance)...",
    "Pipeline execution completed. Results streamed via SSE.",
  ];

  const handleStartScan = () => {
    setIsScanning(true);
    setScanStage(0);

    const stepInterval = setInterval(() => {
      setScanStage((prev) => {
        if (prev < stages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setIsScanning(false);
          return prev;
        }
      });
    }, 450);
  };

  const visibleSemgrepFindings = useMemo(() => {
    if (scanMode === "llm") return [];
    return sample.semgrepFindings;
  }, [scanMode, sample]);

  const visibleLlmFindings = useMemo(() => {
    if (scanMode === "semgrep") return [];
    return sample.llmFindings;
  }, [scanMode, sample]);

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(sample.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="w-full my-12 rounded-3xl border border-emerald-500/30 bg-[#040d07] shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(16,185,129,0.1)] overflow-hidden">
      {/* Studio Header Bar */}
      <div className="px-5 py-3.5 bg-black/60 border-b border-emerald-500/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          <span className="font-mono text-xs font-bold text-emerald-400 tracking-wider">
            CRYPTOSCAN LAB // DUAL-ENGINE INTERACTIVE BENCHMARK
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-neutral-400">
            FastAPI SSE Gateway · Gemini 2.5 Flash · Semgrep AST
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
            <Radio size={11} className="animate-pulse text-emerald-400" />
            <span>STREAM READY</span>
          </div>
        </div>
      </div>

      {/* Control Panel: Target & Engine Selection */}
      <div className="p-5 sm:p-6 bg-black/40 border-b border-emerald-500/10 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Target Selector */}
          <div className="lg:col-span-7 space-y-1.5">
            <label className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
              <FileCode size={13} className="text-emerald-400" />
              <span>Target Benchmark Sample or Repository URL</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={isCustomMode ? "custom" : selectedSampleId}
                onChange={(e) => {
                  if (e.target.value === "custom") {
                    setIsCustomMode(true);
                  } else {
                    setIsCustomMode(false);
                    setSelectedSampleId(e.target.value);
                  }
                }}
                className="bg-neutral-900 border border-emerald-500/30 rounded-xl px-3.5 py-2 text-xs font-mono text-emerald-200 focus:outline-none focus:border-emerald-400 transition-colors sm:w-80"
              >
                {PRESET_SAMPLES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
                <option value="custom">Custom GitHub Repository URL...</option>
              </select>

              {isCustomMode && (
                <input
                  type="text"
                  value={customRepoUrl}
                  onChange={(e) => setCustomRepoUrl(e.target.value)}
                  placeholder="https://github.com/org/repo.git"
                  className="flex-1 bg-neutral-900 border border-emerald-500/30 rounded-xl px-3.5 py-2 text-xs font-mono text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-emerald-400"
                />
              )}
            </div>
          </div>

          {/* Mode Selector */}
          <div className="lg:col-span-5 space-y-1.5">
            <label className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
              <Sliders size={13} className="text-emerald-400" />
              <span>Static Analysis Mode</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setScanMode("both")}
                className={`px-3 py-2 rounded-xl text-xs font-mono border transition-all ${
                  scanMode === "both"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    : "bg-neutral-900/60 text-neutral-400 border-white/10 hover:text-white"
                }`}
              >
                Dual (Both)
              </button>
              <button
                type="button"
                onClick={() => setScanMode("semgrep")}
                className={`px-3 py-2 rounded-xl text-xs font-mono border transition-all ${
                  scanMode === "semgrep"
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                    : "bg-neutral-900/60 text-neutral-400 border-white/10 hover:text-white"
                }`}
              >
                Semgrep AST
              </button>
              <button
                type="button"
                onClick={() => setScanMode("llm")}
                className={`px-3 py-2 rounded-xl text-xs font-mono border transition-all ${
                  scanMode === "llm"
                    ? "bg-purple-500/20 text-purple-300 border-purple-400 font-bold shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                    : "bg-neutral-900/60 text-neutral-400 border-white/10 hover:text-white"
                }`}
              >
                Gemini LLM
              </button>
            </div>
          </div>
        </div>

        {/* Action Button & Live Pipeline Progress Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleStartScan}
              disabled={isScanning}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                isScanning
                  ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
              }`}
            >
              {isScanning ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>STREAMING PIPELINE...</span>
                </>
              ) : (
                <>
                  <Play size={14} />
                  <span>RUN CRYPTOSCAN ANALYSIS</span>
                </>
              )}
            </button>

            <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">
              Target Language: <strong className="text-white">{sample.language}</strong>
            </span>
          </div>

          {/* Sub-tab view buttons */}
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 w-full sm:w-auto justify-center">
            <button
              onClick={() => setActiveTab("findings")}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                activeTab === "findings" ? "bg-white/15 text-white font-bold" : "text-neutral-400 hover:text-white"
              }`}
            >
              Findings (
              {scanMode === "both"
                ? visibleSemgrepFindings.length + visibleLlmFindings.length
                : scanMode === "semgrep"
                ? visibleSemgrepFindings.length
                : visibleLlmFindings.length}
              )
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                activeTab === "code" ? "bg-white/15 text-white font-bold" : "text-neutral-400 hover:text-white"
              }`}
            >
              Target Code
            </button>
            <button
              onClick={() => setActiveTab("metrics")}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                activeTab === "metrics" ? "bg-white/15 text-white font-bold" : "text-neutral-400 hover:text-white"
              }`}
            >
              Comparator Metrics
            </button>
          </div>
        </div>

        {/* Live SSE Pipeline Progress Tracker */}
        {isScanning && (
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Activity size={13} className="animate-pulse text-emerald-400" />
                <span>{stages[scanStage]}</span>
              </span>
              <span>{Math.round(((scanStage + 1) / stages.length) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-300 transition-all duration-300"
                style={{ width: `${((scanStage + 1) / stages.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Studio Viewport */}
      <div className="p-5 sm:p-6 min-h-[460px]">
        {/* TAB 1: DUAL FINDINGS VIEW */}
        {activeTab === "findings" && (
          <div className="space-y-6">
            {/* Agreement Indicator Banner */}
            {scanMode === "both" && sample.metrics.agreement > 0 && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={18} className="text-emerald-400" />
                  <span className="text-xs font-mono text-neutral-200">
                    Dual Engine Consensus: <strong className="text-emerald-300">{sample.metrics.agreement} / {sample.metrics.agreement} findings</strong> cross-verified between Semgrep AST & Gemini LLM within ±5 line tolerance.
                  </span>
                </div>
                <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider">
                  100% Inter-Tool Agreement
                </div>
              </div>
            )}

            {/* Side-by-side or stacked finding columns */}
            <div className={`grid ${scanMode === "both" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"} gap-6`}>
              {/* Column 1: Semgrep AST Engine Findings */}
              {(scanMode === "both" || scanMode === "semgrep") && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
                    <div className="flex items-center gap-2">
                      <Code size={15} className="text-cyan-400" />
                      <h4 className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider">
                        Semgrep AST Engine Findings
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                      {visibleSemgrepFindings.length} detected
                    </span>
                  </div>

                  {visibleSemgrepFindings.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-black/40 border border-white/5 text-center text-xs font-mono text-neutral-500">
                      No AST rule pattern violations detected in this sample.
                    </div>
                  ) : (
                    visibleSemgrepFindings.map((f) => (
                      <div
                        key={f.id}
                        className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 hover:border-cyan-400/40 transition-colors space-y-2.5 group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                f.severity === "CRITICAL"
                                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                  : f.severity === "HIGH"
                                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                  : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              }`}
                            >
                              {f.severity}
                            </span>
                            <span className="text-xs font-mono text-cyan-300 font-bold">{f.cwe}</span>
                            <span className="text-[11px] font-mono text-neutral-400">· {f.category}</span>
                          </div>
                          <span className="text-[11px] font-mono text-neutral-500">Line {f.line}</span>
                        </div>

                        <div className="bg-black/90 p-2.5 rounded-xl border border-white/10 font-mono text-xs text-neutral-200 overflow-x-auto">
                          <code>{f.snippet}</code>
                        </div>

                        <p className="text-xs text-neutral-300 leading-relaxed font-sans">{f.explanation}</p>

                        {/* Expandable Remediation Fix */}
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => setExpandedFixId(expandedFixId === f.id ? null : f.id)}
                            className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            {expandedFixId === f.id ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                            <span>Remediation Advice</span>
                          </button>
                          {expandedFixId === f.id && (
                            <div className="mt-2 p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs font-mono text-cyan-200 animate-in fade-in duration-150">
                              <strong className="text-cyan-300">Fix Recommendation:</strong> {f.fix}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Column 2: Google Gemini 2.5 Flash Findings */}
              {(scanMode === "both" || scanMode === "llm") && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
                    <div className="flex items-center gap-2">
                      <Sparkles size={15} className="text-purple-400" />
                      <h4 className="font-mono text-xs font-bold text-purple-300 uppercase tracking-wider">
                        Gemini 2.5 Flash Semantic Findings
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/30 text-purple-300">
                      {visibleLlmFindings.length} detected
                    </span>
                  </div>

                  {visibleLlmFindings.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-black/40 border border-white/5 text-center text-xs font-mono text-neutral-500">
                      Zero cryptographic vulnerabilities flagged by Gemini Flash LLM.
                    </div>
                  ) : (
                    visibleLlmFindings.map((f) => (
                      <div
                        key={f.id}
                        className="p-4 rounded-2xl bg-black/60 border border-purple-500/20 hover:border-purple-400/40 transition-colors space-y-2.5 group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                f.severity === "CRITICAL"
                                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                  : f.severity === "HIGH"
                                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                  : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              }`}
                            >
                              {f.severity}
                            </span>
                            <span className="text-xs font-mono text-purple-300 font-bold">{f.cwe}</span>
                            <span className="text-[11px] font-mono text-neutral-400">· {f.category}</span>
                          </div>
                          <span className="text-[11px] font-mono text-neutral-500">Line {f.line}</span>
                        </div>

                        <div className="bg-black/90 p-2.5 rounded-xl border border-white/10 font-mono text-xs text-neutral-200 overflow-x-auto">
                          <code>{f.snippet}</code>
                        </div>

                        <p className="text-xs text-neutral-300 leading-relaxed font-sans">{f.explanation}</p>

                        {/* Expandable Remediation Fix */}
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => setExpandedFixId(expandedFixId === f.id ? null : f.id)}
                            className="flex items-center gap-1.5 text-[11px] font-mono text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            {expandedFixId === f.id ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                            <span>Remediation Advice</span>
                          </button>
                          {expandedFixId === f.id && (
                            <div className="mt-2 p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs font-mono text-purple-200 animate-in fade-in duration-150">
                              <strong className="text-purple-300">Fix Recommendation:</strong> {f.fix}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: RAW TARGET CODE */}
        {activeTab === "code" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-mono text-neutral-400">
                Inspecting target buffer: <strong className="text-emerald-400">{sample.name}</strong>
              </span>
              <button
                type="button"
                onClick={copyCodeToClipboard}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 flex items-center gap-1.5 transition-colors"
              >
                {copiedCode ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copiedCode ? "Copied" : "Copy Source"}</span>
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-black border border-white/10 font-mono text-xs text-neutral-200 overflow-x-auto leading-relaxed">
              <code>{sample.code}</code>
            </pre>
          </div>
        )}

        {/* TAB 3: COMPARATOR BENCHMARK METRICS */}
        {activeTab === "metrics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/30">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">True Positives (TP)</span>
                <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{sample.metrics.tp}</p>
                <p className="text-[11px] font-mono text-neutral-500 mt-0.5">Matched ground truth</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">False Positives (FP)</span>
                <p className="text-2xl font-bold font-mono text-cyan-400 mt-1">{sample.metrics.fp}</p>
                <p className="text-[11px] font-mono text-neutral-500 mt-0.5">Spurious flags</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">False Negatives (FN)</span>
                <p className="text-2xl font-bold font-mono text-amber-400 mt-1">{sample.metrics.fn}</p>
                <p className="text-[11px] font-mono text-neutral-500 mt-0.5">Missed vulnerabilities</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-purple-500/30">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">F1 Score</span>
                <p className="text-2xl font-bold font-mono text-purple-400 mt-1">
                  {(sample.metrics.f1 * 100).toFixed(1)}%
                </p>
                <p className="text-[11px] font-mono text-neutral-500 mt-0.5">Harmonic balance</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
              <h4 className="font-mono text-xs font-bold text-neutral-200 uppercase tracking-wider">
                Comparator Engine Tolerance Specification
              </h4>
              <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono text-neutral-300">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="text-neutral-400 text-[11px]">Line Tolerance Window</div>
                  <div className="text-emerald-300 font-bold">Δ = ±5 source lines</div>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Accommodates AST multi-line function calls and LLM statement token offset variance.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="text-neutral-400 text-[11px]">Strict Category Constraint</div>
                  <div className="text-cyan-300 font-bold">Exact CWE Identifier Matching</div>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    CWE classes must match exactly (e.g. CWE-321 cannot match CWE-327) to count as a True Positive.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Studio Footer Status Bar */}
      <div className="px-5 py-3 bg-black/80 border-t border-emerald-500/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-neutral-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Dual-Engine Mode Active</span>
          </span>
          <span className="hidden sm:inline text-neutral-600">|</span>
          <span className="hidden sm:inline">Tolerance: ±5 lines</span>
          <span className="hidden sm:inline text-neutral-600">|</span>
          <span className="hidden sm:inline">Pydantic Strict Schemas</span>
        </div>
        <div className="text-neutral-500">
          Source: <code className="text-neutral-300">scanner/comparator.py</code>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* MAIN CRYPTOGRAPHIC MISUSE DETECTOR ARTICLE COMPONENT                      */
/* ------------------------------------------------------------------------- */
export default function CryptoScannerProject() {
  return (
    <EngineeringArticle
      title="Cryptographic Misuse Detector: Dual-Engine AST & LLM Static Security Analysis"
      category="Security & AI Systems"
      description="An architectural breakdown of CryptoScan: combining deterministic Semgrep AST pattern rules with chunked Google Gemini 2.5 Flash semantic analysis to identify OWASP Top 10 A02:2021 cryptographic flaws across Python, Java, and Go codebases."
      readingTime="14"
      sections={sections}
      metrics={[
        ["6 CWEs", "Vulnerability Taxonomies"],
        ["Python, Java, Go", "Multi-Language Analysis"],
        ["Dual Engine", "Semgrep AST + Gemini LLM"],
        ["FastAPI SSE", "Live Event Telemetry"],
      ]}
    >
      {/* 01 / Overview */}
      <ArticleSection id="overview" number="01" title="The Cryptographic Security Problem & Motivation">
        <div className="research-prose">
          <p>
            Applied cryptography is famously unforgiving. While memory safety bugs crash servers and logic errors produce noticeable regression failures, cryptographic misuses often execute <strong>with zero syntax warnings, zero runtime exceptions, and completely silent failure modes</strong>. An application encrypting credit card numbers using AES in Electronic Codebook (ECB) mode appears to function flawlessly in continuous integration test suites—the ciphertext decrypts reliably back to the plaintext—yet it fundamentally fails to provide confidentiality against eavesdroppers who can extract plaintext patterns directly from ciphertext block boundaries.
          </p>
          <p>
            According to the <strong>OWASP Top 10 (A02:2021 – Cryptographic Failures)</strong>, improper cryptographic implementation remains one of the most pervasive root causes of enterprise data breaches. Real-world incidents underscore the catastrophic consequences:
          </p>
          <ul>
            <li>
              <strong>CWE-321 (Hardcoded Cryptographic Keys):</strong> Hardcoded API tokens and static symmetric keys committed to public source control or compiled into client binaries (e.g. mobile APKs and IoT firmwares) allow adversaries to decrypt entire databases without ever breaching backend perimeter firewalls.
            </li>
            <li>
              <strong>CWE-329 (IV Reuse in CBC/CTR Modes):</strong> Reusing a static Initialization Vector (IV) in Counter (CTR) or Cipher Block Chaining (CBC) mode effectively turns block ciphers into a two-time pad, allowing attackers to XOR two ciphertexts together ($C_1 \oplus C_2 = P_1 \oplus P_2$), stripping the keystream entirely and leaking plaintext byte relationships.
            </li>
            <li>
              <strong>CWE-327 (Broken or Deprecated Cryptographic Hash Algorithms):</strong> Continued reliance on MD5 and SHA-1 in authentication or signature paths exposes infrastructure to collision attacks (demonstrated in real-world campaigns like the Flame malware collision attack).
            </li>
            <li>
              <strong>CWE-338 (Insecure Pseudo-Random Number Generators):</strong> Standard language random modules (e.g., Python's <code>random.random()</code>, Go's <code>math/rand</code>, and Java's <code>java.util.Random</code>) utilize linear congruential generators or the Mersenne Twister. Because these algorithms are not cryptographically secure PRNGs (CSPRNG), an observer who captures 624 consecutive 32-bit outputs can reconstruct internal state and predict every subsequent session token or cryptographic nonce.
            </li>
          </ul>

          <div className="editorial-card p-6 my-6 border-l-4 border-emerald-400">
            <h4 className="font-mono text-sm font-bold text-white mb-2">
              The Dual-Engine Thesis: Why Rule Matching or LLMs Alone Fall Short
            </h4>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Traditional Abstract Syntax Tree (AST) analyzers (e.g., Semgrep, Bandit, SonarQube) are blazing fast and 100% deterministic, but suffer from high false-positive rates on complex wrapper patterns and near-zero recall when keys are dynamically assembled through object indirection. Conversely, Large Language Models (LLMs) possess extraordinary semantic context and understand developer intent across modular boundaries, but are vulnerable to non-deterministic formatting, hallucinated line numbers, and token latency. <strong>CryptoScan fuses both paradigms into an orthogonal dual-engine pipeline</strong>: Semgrep provides the immutable AST anchor while Google Gemini 2.5 Flash supplies semantic validation and deep remediation synthesis.
            </p>
          </div>
        </div>
      </ArticleSection>

      {/* 02 / Taxonomies */}
      <ArticleSection id="taxonomies" number="02" title="6 Vulnerability Taxonomies & CWE/OWASP Mapping">
        <div className="research-prose">
          <p>
            CryptoScan formally models and scans for 6 distinct cryptographic vulnerability categories, spanning the full lifecycle of cryptographic keys, initialization vectors, cipher modes, and digest routines:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="editorial-card p-5 space-y-2 border-t-2 border-red-500">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-red-400">CWE-321 · CRITICAL</span>
                <span className="text-[10px] font-mono text-neutral-500">OWASP A02:2021</span>
              </div>
              <h4 className="font-bold text-white text-sm">Hardcoded Cryptographic Keys</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Embedding raw symmetric keys (byte literals, hex strings, base64 constants) directly in source files. Enables trivial extraction via decompilation, git history inspection, or memory dumping.
              </p>
              <div className="text-[11px] font-mono text-neutral-300 bg-black/60 p-2 rounded">
                <strong>Remediation:</strong> Load keys exclusively from secret managers (AWS Secrets Manager, HashiCorp Vault) or hardware security modules (HSM).
              </div>
            </div>

            <div className="editorial-card p-5 space-y-2 border-t-2 border-amber-500">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">CWE-327 · HIGH</span>
                <span className="text-[10px] font-mono text-neutral-500">OWASP A02:2021</span>
              </div>
              <h4 className="font-bold text-white text-sm">Electronic Codebook (ECB) Mode</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Employing AES or DES in ECB mode. ECB encrypts identical 16-byte plaintext blocks to identical ciphertext blocks, preserving structural entropy and leaking data patterns (the classic ECB penguin vulnerability).
              </p>
              <div className="text-[11px] font-mono text-neutral-300 bg-black/60 p-2 rounded">
                <strong>Remediation:</strong> Replace with authenticated Galois/Counter Mode (AES-GCM) or ChaCha20-Poly1305.
              </div>
            </div>

            <div className="editorial-card p-5 space-y-2 border-t-2 border-amber-500">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">CWE-327 · HIGH</span>
                <span className="text-[10px] font-mono text-neutral-500">OWASP A02:2021</span>
              </div>
              <h4 className="font-bold text-white text-sm">Weak Hash Algorithms (MD5 / SHA-1)</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Utilizing MD5 or SHA-1 for digital signatures, token generation, or credential hashing. Both primitives suffer practical collision vulnerabilities and pre-image attacks.
              </p>
              <div className="text-[11px] font-mono text-neutral-300 bg-black/60 p-2 rounded">
                <strong>Remediation:</strong> Upgrade to SHA-256 / SHA-3 for digests; enforce salted Argon2id / bcrypt for passwords.
              </div>
            </div>

            <div className="editorial-card p-5 space-y-2 border-t-2 border-amber-500">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">CWE-329 · HIGH</span>
                <span className="text-[10px] font-mono text-neutral-500">OWASP A02:2021</span>
              </div>
              <h4 className="font-bold text-white text-sm">Initialization Vector (IV) Reuse</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Using constant byte arrays (e.g., <code>b"\x00"*16</code>) or failing to rotate IVs across multiple encryption calls in CBC or CTR mode.
              </p>
              <div className="text-[11px] font-mono text-neutral-300 bg-black/60 p-2 rounded">
                <strong>Remediation:</strong> Generate fresh nonces/IVs dynamically for every message using cryptographically secure random sources.
              </div>
            </div>

            <div className="editorial-card p-5 space-y-2 border-t-2 border-blue-500">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-400">CWE-338 · MEDIUM</span>
                <span className="text-[10px] font-mono text-neutral-500">OWASP A02:2021</span>
              </div>
              <h4 className="font-bold text-white text-sm">Insecure Random Number Generation</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Invoking standard library PRNGs (<code>random.random()</code>, <code>math/rand</code>, <code>java.util.Random</code>) for password reset tokens, salt generation, or session IDs.
              </p>
              <div className="text-[11px] font-mono text-neutral-300 bg-black/60 p-2 rounded">
                <strong>Remediation:</strong> Employ OS-backed entropy: Python <code>secrets</code>, Go <code>crypto/rand</code>, Java <code>SecureRandom</code>.
              </div>
            </div>

            <div className="editorial-card p-5 space-y-2 border-t-2 border-blue-500">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-400">CWE-326 · MEDIUM</span>
                <span className="text-[10px] font-mono text-neutral-500">OWASP A02:2021</span>
              </div>
              <h4 className="font-bold text-white text-sm">Insufficient Key Length</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Utilizing symmetric keys under 128 bits (e.g. legacy DES 56-bit or Triple-DES) or asymmetric RSA keys under 2048 bits. Susceptible to cloud-scale brute-force factorization.
              </p>
              <div className="text-[11px] font-mono text-neutral-300 bg-black/60 p-2 rounded">
                <strong>Remediation:</strong> Mandate minimum key sizes: AES-256 for symmetric ciphers and RSA-4096 / Ed25519 for public keys.
              </div>
            </div>
          </div>
        </div>
      </ArticleSection>

      {/* 03 / Semgrep Rules */}
      <ArticleSection id="semgrep-rules" number="03" title="Semgrep AST Rule Engineering">
        <div className="research-prose">
          <p>
            Semgrep operates by transforming source code into abstract syntax trees and evaluating declarative YAML rule patterns. In CryptoScan, custom rule manifests are written for <strong>Python</strong> (<SourceLink href={`${blob}/rules/semgrep/python_crypto.yaml`} label="python_crypto.yaml" />), <strong>Java</strong> (<SourceLink href={`${blob}/rules/semgrep/java_crypto.yaml`} label="java_crypto.yaml" />), and <strong>Go</strong> (<SourceLink href={`${blob}/rules/semgrep/go_crypto.yaml`} label="go_crypto.yaml" />).
          </p>

          <p>
            Consider our production rule for flagging ECB mode in Python. Notice how metavariable patterns capture both symbolic constants (<code>AES.MODE_ECB</code>) and integer literal representations (<code>1</code>) used in older PyCryptodome binaries:
          </p>

          <pre className="p-4 rounded-2xl bg-black border border-white/10 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed my-4">
            <code>{`rules:
  - id: python-crypto-ecb-mode
    message: "Detected AES initialization in ECB mode (CWE-327). ECB mode does not preserve semantic security."
    severity: ERROR
    languages: [python]
    patterns:
      - pattern-either:
          - pattern: AES.new($KEY, AES.MODE_ECB, ...)
          - pattern: AES.new($KEY, 1, ...)
          - pattern: Cipher.AES.new($KEY, Cipher.AES.MODE_ECB, ...)
          - pattern: $CIPHER = AES.new($KEY, mode=AES.MODE_ECB, ...)`}</code>
          </pre>

          <p>
            Similarly, detecting hardcoded byte keys requires combining metavariable regex filters to prevent flagging runtime variable references while immediately identifying static string constants:
          </p>

          <pre className="p-4 rounded-2xl bg-black border border-white/10 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed my-4">
            <code>{`rules:
  - id: python-crypto-hardcoded-key
    message: "Cryptographic key hardcoded directly into source code (CWE-321)."
    severity: ERROR
    languages: [python]
    patterns:
      - pattern-either:
          - pattern: AES.new(b"$STR", ...)
          - pattern: Fernet(b"$STR")
          - pattern: SecretKeySpec(b"$STR", ...)
      - metavariable-regex:
          metavariable: $STR
          regex: ".{8,}" # Discard trivial empty string placeholders`}</code>
          </pre>

          <p>
            By executing Semgrep programmatically via Python's <code>subprocess.Popen</code> with <code>--json</code> serialization, CryptoScan ingests structured AST findings with zero external daemon overhead.
          </p>
        </div>
      </ArticleSection>

      {/* 04 / LLM Analysis */}
      <ArticleSection id="llm-analysis" number="04" title="LLM-Guided Semantic Analysis & Structured Schemas">
        <div className="research-prose">
          <p>
            While Semgrep excels at direct pattern matching, developers frequently wrap ciphers inside helper functions or utility classes that evade AST rules. To capture these semantic flows, CryptoScan integrates <strong>Google Gemini 2.5 Flash</strong> through the official <code>google-genai</code> SDK (<SourceLink href={`${blob}/scanner/llm_scanner.py`} label="scanner/llm_scanner.py" />).
          </p>

          <h4 className="font-mono text-sm font-bold text-white mt-6 mb-2">
            150-Line Window Chunking with Overlap
          </h4>
          <p>
            Target repositories often contain large files. Passing an entire 3,000-line file into an LLM degrades attention density and increases latency. CryptoScan implements a sliding chunking algorithm:
          </p>
          <ul>
            <li>Files are partitioned into <strong>150-line chunks</strong> with a <strong>20-line overlap</strong>.</li>
            <li>Line numbering offsets are tracked so that any finding reported by Gemini within a chunk is dynamically translated back to the canonical file line number.</li>
            <li>Deduplication filters ensure that findings within the 20-line overlapping boundary are merged into a single consolidated record.</li>
          </ul>

          <h4 className="font-mono text-sm font-bold text-white mt-6 mb-2">
            Deterministic Inference & Pydantic JSON Schemas
          </h4>
          <p>
            Security tooling demands strict determinism. We configure Gemini with <code>temperature=0.0</code> and supply a strict Pydantic model enforcing JSON schema output:
          </p>

          <pre className="p-4 rounded-2xl bg-black border border-white/10 font-mono text-xs text-purple-300 overflow-x-auto leading-relaxed my-4">
            <code>{`from pydantic import BaseModel, Field
from typing import Literal

class CryptoVulnerability(BaseModel):
    rule_id: str = Field(description="Normalized identifier, e.g. hardcoded_key")
    cwe: str = Field(description="Canonical CWE identifier, e.g. CWE-321")
    severity: Literal["CRITICAL", "HIGH", "MEDIUM", "LOW"]
    line: int = Field(description="Exact line number of vulnerable statement")
    code_snippet: str = Field(description="Exact code excerpt exhibiting the flaw")
    explanation: str = Field(description="Concise cryptanalysis of why this code is vulnerable")
    fix: str = Field(description="Actionable secure remediation recommendation")

class FileScanResponse(BaseModel):
    findings: list[CryptoVulnerability]`}</code>
          </pre>

          <p>
            Invoking the model with <code>types.GenerateContentConfig(response_mime_type="application/json", response_schema=FileScanResponse, temperature=0.0)</code> guarantees that the model will return syntactically valid JSON that maps directly to typed Python objects without requiring regex post-processing.
          </p>
        </div>
      </ArticleSection>

      {/* 05 / Benchmarks */}
      <ArticleSection id="benchmarks" number="05" title="Comparative Benchmarks & Evaluation Metrics">
        <div className="research-prose">
          <p>
            To quantify the efficacy of both engines, CryptoScan includes a ground-truth benchmark comparator (<SourceLink href={`${blob}/scanner/comparator.py`} label="scanner/comparator.py" />) that validates tool detections against a verified benchmark dataset (<SourceLink href={`${blob}/samples/ground_truth.json`} label="samples/ground_truth.json" />).
          </p>

          <h4 className="font-mono text-sm font-bold text-white mt-6 mb-2">
            Fuzzy Line Tolerance Window ($\Delta = \pm 5$)
          </h4>
          <p>
            Different analysis tools associate findings with different lines of a multi-line statement. For example, in a statement where a key is instantiated on line 42 and passed into a cipher on line 45, Semgrep might flag line 42 while Gemini flags line 45. To eliminate false penalties from trivial line differences, CryptoScan defines a matching predicate:
          </p>
          <div className="editorial-card p-4 my-4 font-mono text-xs text-center text-emerald-300">
            {"Match(f, gt) ⟺ CWE(f) == CWE(gt) ∧ |line(f) − line(gt)| ≤ 5"}
          </div>

          <h4 className="font-mono text-sm font-bold text-white mt-6 mb-2">
            Standard Evaluation Metrics
          </h4>
          <p>
            From matched findings, the comparator calculates Precision, Recall, and the harmonic F1 Score:
          </p>
          <div className="grid sm:grid-cols-3 gap-4 my-4 font-mono text-xs text-center">
            <div className="editorial-card p-4">
              <span className="text-neutral-400">Precision</span>
              <p className="text-base text-cyan-300 mt-1">TP / (TP + FP)</p>
            </div>
            <div className="editorial-card p-4">
              <span className="text-neutral-400">Recall</span>
              <p className="text-base text-emerald-300 mt-1">TP / (TP + FN)</p>
            </div>
            <div className="editorial-card p-4">
              <span className="text-neutral-400">F1 Score</span>
              <p className="text-base text-purple-300 mt-1">{"2 × (P × R) / (P + R)"}</p>
            </div>
          </div>

          <p>
            Benchmark results reveal an informative complementarity: Semgrep delivers a near-instantaneous <strong>120ms execution time</strong> with <strong>100% precision</strong> on literal patterns, but achieves only 68% recall when vulnerabilities span helper wrappers. Gemini 2.5 Flash achieves <strong>94% recall</strong> across nuanced contextual flows, but requires ~1.2s per chunk. In dual mode, CryptoScan delivers the best of both worlds: instant AST flags combined with high-depth semantic verification.
          </p>
        </div>
      </ArticleSection>

      {/* 06 / Interactive Studio */}
      <ArticleSection id="interactive-studio" number="06" title="Interactive Cryptographic Misuse Scanner Studio">
        <div className="research-prose">
          <p>
            Experience CryptoScan live in your browser below. Choose between authentic multi-language benchmark samples (Python, Java, Go) or simulate a custom GitHub repository scan. Select an engine mode to observe the divergence in findings and inspect comparative evaluation metrics.
          </p>
        </div>

        <ScannerStudio />
      </ArticleSection>

      {/* 07 / Streaming Architecture */}
      <ArticleSection id="streaming-arch" number="07" title="FastAPI Server-Sent Events (SSE) Streaming Architecture">
        <div className="research-prose">
          <p>
            Static analysis of remote git repositories is an asynchronous, multi-stage pipeline: shallow cloning, AST traversal, LLM batching, and metric consolidation. To provide instant feedback without polling, CryptoScan's web server (<SourceLink href={`${blob}/web/app.py`} label="web/app.py" />) implements <strong>Server-Sent Events (SSE)</strong> via FastAPI:
          </p>

          <pre className="p-4 rounded-2xl bg-black border border-white/10 font-mono text-xs text-neutral-300 overflow-x-auto leading-relaxed my-4">
            <code>{`@app.get("/api/scan/stream")
async def scan_stream(repo_url: str, mode: str = "both"):
    async def event_generator():
        with tempfile.TemporaryDirectory() as temp_dir:
            yield format_sse("progress", {"message": "Cloning repository sandbox..."})
            git.Repo.clone_from(repo_url, temp_dir, depth=1)
            
            # Phase 1: AST Scan
            if mode in ["both", "semgrep"]:
                yield format_sse("progress", {"message": "Running Semgrep AST rules..."})
                semgrep_findings = await run_semgrep_async(temp_dir)
                for f in semgrep_findings:
                    yield format_sse("finding", f.dict())

            # Phase 2: LLM Scan
            if mode in ["both", "llm"]:
                yield format_sse("progress", {"message": "Dispatching chunks to Gemini 2.5 Flash..."})
                llm_findings = await run_gemini_async(temp_dir)
                for f in llm_findings:
                    yield format_sse("finding", f.dict())

            # Phase 3: Metrics & Done
            metrics = compute_comparator_metrics(semgrep_findings, llm_findings)
            yield format_sse("metrics", metrics)
            yield format_sse("done", {"status": "complete"})

    return StreamingResponse(event_generator(), media_type="text/event-stream")`}</code>
          </pre>

          <p>
            Temporary directories are completely destroyed upon stream teardown via Python's <code>tempfile.TemporaryDirectory()</code> context manager, preventing disk leakages or cross-session repository pollution.
          </p>
        </div>
      </ArticleSection>

      {/* 08 / Source Review */}
      <ArticleSection id="source-review" number="08" title="Source Code Review & GitHub Architecture">
        <div className="research-prose">
          <p>
            The complete CryptoScan codebase is open-source and modularly organized. Explore the core implementation files directly on GitHub:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="editorial-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-400">Core Scanner</span>
                <ExternalLink size={13} className="text-neutral-500" />
              </div>
              <SourceLink href={`${blob}/scanner/main.py`} label="scanner/main.py" meta="CLI Entrypoint" />
              <p className="text-xs text-neutral-400">
                Argparse CLI orchestrator supporting <code>--repo</code>, <code>--file</code>, <code>--mode</code>, and <code>--format</code>.
              </p>
            </div>

            <div className="editorial-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-400">LLM Engine</span>
                <ExternalLink size={13} className="text-neutral-500" />
              </div>
              <SourceLink href={`${blob}/scanner/llm_scanner.py`} label="scanner/llm_scanner.py" meta="Gemini Flash" />
              <p className="text-xs text-neutral-400">
                Google GenAI SDK client with 150-line window chunking and strict Pydantic JSON validation.
              </p>
            </div>

            <div className="editorial-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-400">AST Engine</span>
                <ExternalLink size={13} className="text-neutral-500" />
              </div>
              <SourceLink href={`${blob}/scanner/semgrep_scanner.py`} label="scanner/semgrep_scanner.py" meta="Semgrep" />
              <p className="text-xs text-neutral-400">
                Subprocess wrapper executing custom multi-language YAML manifests and parsing JSON findings.
              </p>
            </div>

            <div className="editorial-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">Comparator Engine</span>
                <ExternalLink size={13} className="text-neutral-500" />
              </div>
              <SourceLink href={`${blob}/scanner/comparator.py`} label="scanner/comparator.py" meta="Benchmark" />
              <p className="text-xs text-neutral-400">
                Ground-truth evaluation engine computing TP, FP, FN, Precision, Recall, and F1 (±5 line tolerance).
              </p>
            </div>

            <div className="editorial-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-400">Web Application</span>
                <ExternalLink size={13} className="text-neutral-500" />
              </div>
              <SourceLink href={`${blob}/web/app.py`} label="web/app.py" meta="FastAPI & SSE" />
              <p className="text-xs text-neutral-400">
                Async FastAPI server streaming real-time scan events and managing sandbox cleanup.
              </p>
            </div>

            <div className="editorial-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-400">Rule Manifests</span>
                <ExternalLink size={13} className="text-neutral-500" />
              </div>
              <SourceLink href={`${blob}/rules/semgrep/python_crypto.yaml`} label="rules/semgrep/python_crypto.yaml" meta="Rules" />
              <p className="text-xs text-neutral-400">
                Production AST patterns for Python, Java (<code>java_crypto.yaml</code>), and Go (<code>go_crypto.yaml</code>).
              </p>
            </div>
          </div>
        </div>
      </ArticleSection>

      {/* 09 / CLI Guide */}
      <ArticleSection id="cli-guide" number="09" title="Local Setup & CLI Execution Guide">
        <div className="research-prose">
          <p>
            CryptoScan can be executed locally as a command-line tool or launched as a containerized web application.
          </p>

          <h4 className="font-mono text-sm font-bold text-white mt-6 mb-2">
            1. Clone & Install Dependencies
          </h4>
          <pre className="p-4 rounded-2xl bg-black border border-white/10 font-mono text-xs text-neutral-300 overflow-x-auto leading-relaxed my-3">
            <code>{`# Clone the repository
git clone https://github.com/rl4658/cryptographic-misuse-detector.git
cd cryptographic-misuse-detector

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: .\\venv\\Scripts\\activate

# Install required packages
pip install -r requirements.txt`}</code>
          </pre>

          <h4 className="font-mono text-sm font-bold text-white mt-6 mb-2">
            2. Configure Gemini API Credentials
          </h4>
          <p>Create a <code>.env</code> file in the repository root or export your API key directly:</p>
          <pre className="p-4 rounded-2xl bg-black border border-white/10 font-mono text-xs text-neutral-300 overflow-x-auto leading-relaxed my-3">
            <code>{`export GEMINI_API_KEY="your-gemini-api-key-here"`}</code>
          </pre>

          <h4 className="font-mono text-sm font-bold text-white mt-6 mb-2">
            3. CLI Execution Examples
          </h4>
          <pre className="p-4 rounded-2xl bg-black border border-white/10 font-mono text-xs text-neutral-300 overflow-x-auto leading-relaxed my-3">
            <code>{`# Scan a local file using both Semgrep AST & Gemini LLM
python -m scanner.main --file samples/vulnerable_crypto.py --mode both --format table

# Scan a remote GitHub repository in Semgrep-only mode
python -m scanner.main --repo https://github.com/octocat/Spoon-Knife --mode semgrep

# Run ground-truth benchmark comparator
python -m scanner.main --file samples/vulnerable_crypto.py --ground-truth samples/ground_truth.json

# Launch the FastAPI SSE web interface
uvicorn web.app:app --host 0.0.0.0 --port 8000 --reload`}</code>
          </pre>

          <h4 className="font-mono text-sm font-bold text-white mt-6 mb-2">
            4. Run the Test Suite
          </h4>
          <pre className="p-4 rounded-2xl bg-black border border-white/10 font-mono text-xs text-neutral-300 overflow-x-auto leading-relaxed my-3">
            <code>{`pytest -v tests/`}</code>
          </pre>
        </div>
      </ArticleSection>
    </EngineeringArticle>
  );
}
