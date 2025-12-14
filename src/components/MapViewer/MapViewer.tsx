import { useMemo, type HTMLAttributes, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button, Tooltip } from 'antd'
import { CopyOutlined, FileDoneOutlined } from '@ant-design/icons'
import { copyToClipboard } from '../../utils/textUtils'
import { useTextDirection } from '../../hooks/useTextDirection'
import DirectionControls from '../DirectionControls/DirectionControls'
import styles from './MapViewer.module.scss'

interface MapViewerProps {
  content: string
}

function MapViewer({ content }: MapViewerProps) {
  const { directionMode, setDirectionMode, resolvedDirection, directionLabel } =
    useTextDirection({ text: content })

  const handleCopy = async () => {
    await copyToClipboard(content, 'Mapping copied to clipboard')
  }

  const rendered = useMemo(
    () => (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: (props) => <a {...props} target="_blank" rel="noreferrer" />,
          code: ({
            inline,
            className,
            children,
            ...rest
          }: {
            inline?: boolean
            className?: string
            children?: ReactNode
          } & HTMLAttributes<HTMLElement>) =>
            inline ? (
              <code className={styles.inlineCode} {...rest}>{children}</code>
            ) : (
              <pre className={styles.codeBlock}>
                <code className={className} {...rest}>{children}</code>
              </pre>
            )
        }}
      >
        {content}
      </ReactMarkdown>
    ),
    [content]
  )

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.eyebrowRow}>
            <FileDoneOutlined className={styles.titleIcon} />
            <div className={styles.eyebrow}>Mapping preview</div>
          </div>
        </div>
        <Tooltip title="Copy full mapping to clipboard">
          <Button
            type="primary"
            icon={<CopyOutlined />}
            onClick={handleCopy}
          >
            Copy mapping
          </Button>
        </Tooltip>
      </div>

      <div className={styles.shell} dir={resolvedDirection}>
        <DirectionControls
          directionMode={directionMode}
          onDirectionChange={setDirectionMode}
          resolvedDirection={resolvedDirection}
          directionLabel={directionLabel}
        />
        <div className={styles.markdownBody}>{rendered}</div>
      </div>
    </section>
  )
}

export default MapViewer
