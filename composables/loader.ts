import { createVNode, ref, render } from 'vue-demi';
import { PageLoader } from '#components';
import { tryOnBeforeUnmount } from '@vueuse/core';

export function useLoader() {
  const vnode = ref();
  const container = ref();

  const open = (props = {}) => {
    if (container.value instanceof HTMLElement) {
      close();
    }
    if (!vnode.value) {
      vnode.value = undefined;
    }

    container.value = document.createElement('div');
    Object.assign(container.value?.style, {
      position: 'fixed',
      inset: '0',
      zIndex: 100
    });

    document.body.appendChild(container.value);
    vnode.value = createVNode(PageLoader, {
      modelValue: true,
      fullPage: false,
      ...props
    });
    vnode.value.appContext = useNuxtApp().vueApp._context;

    render(vnode.value, container.value);
  };

  const close = () => {
    const doClose = vnode.value?.component?.exposed?.close;
    if (typeof doClose === 'function') {
      doClose();
    }

    if (container.value) {
      render(null, container.value);
      container.value?.remove();
    }
  };

  tryOnBeforeUnmount(close);

  return {
    open,
    close
  };
}
