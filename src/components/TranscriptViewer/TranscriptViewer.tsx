import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Button, Spin } from 'antd'
import { CopyOutlined, ReloadOutlined, FileTextOutlined } from '@ant-design/icons'
import { extractRawText } from 'mammoth/mammoth.browser'
import { copyToClipboard } from '../../utils/textUtils'
import { useTextDirection } from '../../hooks/useTextDirection'
import DirectionControls from '../DirectionControls/DirectionControls'
import styles from './TranscriptViewer.module.scss'

interface TranscriptViewerProps {
  transcriptUrl: string
}

type LoadState = 'idle' | 'loading' | 'ready' | 'error'

const toDocxExportUrl = (url: string) => {
  if (!url) return ''
  const match = url.match(/https?:\/\/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/)
  if (!match) return url
  return `https://docs.google.com/document/d/${match[1]}/export?format=docx`
}

function TranscriptViewer({ transcriptUrl }: TranscriptViewerProps) {
  const [transcriptText, setTranscriptText] = useState('')
  const [loadState, setLoadState] = useState<LoadState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const { directionMode, setDirectionMode, resolvedDirection, directionLabel } =
    useTextDirection({ text: transcriptText })

  const fetchTranscript = useCallback(async () => {
    if (!transcriptUrl) return

    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoadState('loading')
    setErrorMessage(null)

    try {
      const fetchUrl = toDocxExportUrl(transcriptUrl)
      const response = await fetch(fetchUrl, { signal: controller.signal })
      if (!response.ok) {
        throw new Error(`Failed to download transcript (${response.status})`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const { value } = await extractRawText({ arrayBuffer })
      const cleaned = (value || '')
        .replace(/\r\n/g, '\n')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n') // collapse runaway empty lines
        .replace(/:\s*\n\s*\n/g, ':\n') // keep speaker label tight to its text
        .trim()

      setTranscriptText(cleaned)
      setLoadState('ready')
    } catch (error: unknown) {
      if (controller.signal.aborted) return
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Unable to load transcript')
      }
      setLoadState('error')
    }
  }, [transcriptUrl])

  useEffect(() => {
    fetchTranscript()
    return () => abortControllerRef.current?.abort()
  }, [fetchTranscript])

  const handleCopy = async () => {
    if (!transcriptText) return
    await copyToClipboard(transcriptText, 'Transcript copied to clipboard')
  }

  const showCopyButton = loadState === 'ready' && Boolean(transcriptText)

  return (
    <section className={styles.viewerCard} aria-live="polite">
      <div className={styles.viewerHeader}>
        <div className={styles.titleGroup}>
          <div className={styles.eyebrowRow}>
            <FileTextOutlined className={styles.titleIcon} />
            <div className={styles.eyebrow}>Transcript preview</div>
          </div>
        </div>
        <div className={styles.actions}>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchTranscript}
            disabled={loadState === 'loading'}
          >
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<CopyOutlined />}
            onClick={handleCopy}
            disabled={!showCopyButton}
          >
            Copy transcript
          </Button>
        </div>
      </div>

      <div className={styles.cardBody}>
        {loadState === 'loading' && (
          <div className={styles.loadingState}>
            <Spin tip="Fetching transcript..." />
          </div>
        )}

        {loadState === 'error' && (
          <div className={styles.errorState}>
            <Alert
              type="error"
              showIcon
              message="Could not load the transcript"
              description={errorMessage || 'Please try again in a moment.'}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchTranscript}
              block
              size="large"
            >
              Retry
            </Button>
          </div>
        )}

        {loadState === 'ready' && (
          <div className={styles.transcriptShell} dir={resolvedDirection}>
            <DirectionControls
              directionMode={directionMode}
              onDirectionChange={setDirectionMode}
              resolvedDirection={resolvedDirection}
              directionLabel={directionLabel}
            />
            {transcriptText ? (
              <div className={styles.transcriptText}>{transcriptText}</div>
            ) : (
              <div className={styles.emptyState}>
                We loaded the file, but it looks empty.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default TranscriptViewer
