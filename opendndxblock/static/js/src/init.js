/* Javascript for OpenDNDXBlock. */
function OpenDNDXBlock(runtime, element) {
    /**
     * @type {HTMLIFrameElement | null}
     */
    var _element = null;
    var handlerUrl = runtime.handlerUrl(element, 'increment_count');

    /**
     * 
     * @returns {HTMLIFrameElement | null}
     */
    function getNode() {
        if (_element) {
            return _element
        }

        _element = document.querySelector('[data-open-dnd]')
        return _element;
    }

    function initAppData(runtime, element) {
        const node = getNode()

        if (!node) {
            throw new Error('App init error (node not found)')
        }

        setTimeout(() => {
            /** @type {((runtime, element) => void) | null} */
            const callback = node.contentWindow.initApp;

            if (!callback) {
                throw new Error('App init error (init callback not found)')
            }

            callback(runtime, element)
        }, 500)
    }

    function initResizeObserver() {
        const node = getNode()

        if (!node) {
            return
        }

        setTimeout(() => {
            /** @type { HTMLDivElement | null } */
            const rootNode = node.contentDocument.querySelector('#root')

            if (!rootNode) {
                return;
            }

            const observer = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    for (const bbSize of entry.borderBoxSize) {
                        node.style.height = `${bbSize.blockSize}px`

                    }
                }
            })

            observer.observe(rootNode)
        }, 500)
    }

    $(function () {
        initAppData(runtime, element)
        initResizeObserver()
    });
}
