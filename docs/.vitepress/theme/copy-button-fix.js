// Fix copy button - simple: just hide text content
export function fixCopyButtonIcons() {
  if (typeof document === 'undefined') return
  
  function hideText(button) {
    // Hide all text content
    button.querySelectorAll('span').forEach(span => {
      span.style.setProperty('display', 'none', 'important')
    })
    
    // Clear text nodes
    const walker = document.createTreeWalker(button, NodeFilter.SHOW_TEXT)
    let node
    while (node = walker.nextNode()) {
      if (node.textContent.trim()) {
        node.textContent = ''
      }
    }
  }
  
  function fixButtons() {
    document.querySelectorAll('div[class*="language-"] button').forEach(hideText)
  }
  
  // Run after load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(fixButtons, 100))
  } else {
    setTimeout(fixButtons, 100)
  }
  
  // Watch for new buttons
  if (typeof MutationObserver !== 'undefined') {
    new MutationObserver(() => fixButtons()).observe(document.body, {
      subtree: true,
      childList: true
    })
  }
}
