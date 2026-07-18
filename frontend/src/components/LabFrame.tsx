import { useEffect, useRef } from 'react'
import type { ChallengeManifest } from '../types'

interface LabFrameProps {
  challenge: ChallengeManifest
  onComplete: (detail: { score: number; flag?: string; message?: string }) => void
  onFail?: (detail: { message: string }) => void
  onHint?: (text: string) => void
}

function buildSrcdoc(challenge: ChallengeManifest) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <base href="/">
  <link rel="stylesheet" href="/legacy/styles/tokens.css">
  <link rel="stylesheet" href="/legacy/styles/base.css">
  <link rel="stylesheet" href="/legacy/styles/components.css">
  <script src="/legacy/modules/${challenge.domain}/${challenge.id}/lab.js"></script>
  <script src="/legacy/sandbox-runtime.js"></script>
</head>
<body class="lab-body">
</body>
</html>`
}

export function LabFrame({ challenge, onComplete, onFail, onHint }: LabFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const iframe = iframeRef.current
      if (!iframe || event.source !== iframe.contentWindow) return

      const { type, data } = event.data || {}

      if (type === 'ready' && !initializedRef.current) {
        initializedRef.current = true
        ;(event.source as Window).postMessage(
          { type: 'init', data: { challenge } },
          '*'
        )
      } else if (type === 'complete') {
        onComplete(data || {})
      } else if (type === 'fail') {
        onFail?.(data || { message: 'Challenge failed.' })
      } else if (type === 'hint') {
        onHint?.(data?.text || '')
      }
    }

    initializedRef.current = false
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [challenge, onComplete, onFail, onHint])

  return (
    <iframe
      ref={iframeRef}
      title={`Lab: ${challenge.title}`}
      srcDoc={buildSrcdoc(challenge)}
      sandbox="allow-scripts"
      className="w-full h-96 md:h-[30rem] border-2 border-primary rounded"
    />
  )
}
