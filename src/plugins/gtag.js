export default {
  install: (app, { router, id }) => {
    // ✅ detect if running on local dev
    const devHosts = ['localhost', '127.0.0.1', '::1']
    const isDev = devHosts.includes(location.hostname)

    console.log('[GA Plugin] Installed on', location.hostname)

    // helper: send + log
    function sendEvent(name, params = {}) {
      if (window.gtag) {
        window.gtag('event', name, params)
        if (isDev) {
          console.log(
            '%c[GA Event]',
            'color: #4CAF50; font-weight: bold;',
            name,
            params
          )
        }
      } else if (isDev) {
        console.warn('[GA] gtag not loaded yet')
      }
    }

    // ✅ make $gtag available everywhere
    app.config.globalProperties.$gtag = sendEvent

    // ✅ track page views (SPA routes)
    if (router) {
      router.afterEach((to) => {
        if (window.gtag) {
          window.gtag('config', id, { page_path: to.fullPath })
          if (isDev) {
            console.log(
              '%c[GA PageView]',
              'color: #2196F3; font-weight: bold;',
              to.fullPath
            )
          }
        }
      })
    }

    // ✅ track clicks (buttons + links)
    document.addEventListener('click', (e) => {
      const target = e.target.closest('button, a')
      if (target) {
        const label =
          target.innerText ||
          target.getAttribute('aria-label') ||
          target.href ||
          'unknown'
        const type = target.tagName.toLowerCase()
        const isOutbound =
          type === 'a' && target.hostname !== window.location.hostname

        sendEvent(isOutbound ? 'outbound_click' : 'click', {
          event_category: type,
          event_label: label.trim(),
          page_path: window.location.pathname,
          outbound: isOutbound
        })
      }
    })

    // ✅ track form submissions
    document.addEventListener('submit', (e) => {
      const formName =
        e.target.getAttribute('name') ||
        e.target.getAttribute('id') ||
        'unnamed_form'
      sendEvent('form_submit', {
        event_category: 'form',
        event_label: formName,
        page_path: window.location.pathname
      })
    })

    // ✅ track scroll depth
    let lastDepth = 0
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)

      if (scrollPercent >= 25 && lastDepth < 25) {
        sendEvent('scroll', { percent: 25 })
        lastDepth = 25
      } else if (scrollPercent >= 50 && lastDepth < 50) {
        sendEvent('scroll', { percent: 50 })
        lastDepth = 50
      } else if (scrollPercent >= 75 && lastDepth < 75) {
        sendEvent('scroll', { percent: 75 })
        lastDepth = 75
      } else if (scrollPercent >= 100 && lastDepth < 100) {
        sendEvent('scroll', { percent: 100 })
        lastDepth = 100
      }
    })

    // ✅ track video plays
    document.addEventListener(
      'play',
      (e) => {
        if (e.target.tagName.toLowerCase() === 'video') {
          const src = e.target.currentSrc || e.target.src || 'unknown_video'
          sendEvent('video_play', {
            event_category: 'video',
            event_label: src,
            page_path: window.location.pathname
          })
        }
      },
      true
    )

    // ✅ track purchases (manual call after checkout)
    app.config.globalProperties.$trackPurchase = function (order) {
      if (!order) return
      sendEvent('purchase', {
        transaction_id: order.id,
        value: order.total,
        currency: order.currency,
        items: order.items.map((item) => ({
          item_id: item.id,
          item_name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      })
    }
  }
}
