import { toast } from 'sonner';
import Swal from 'sweetalert2';

const BRAND_CONFIRM = '#037B76';
const BRAND_CANCEL = '#586971';
const DANGER_CONFIRM = '#dc2626';

export const notify = {
  success(message, options = {}) {
    toast.success(message, options);
  },

  error(message, options = {}) {
    toast.error(message, options);
  },

  info(message, options = {}) {
    toast.info(message, options);
  },

  warning(message, options = {}) {
    toast.warning(message, options);
  },

  async confirm({
    title = 'Are you sure?',
    text = '',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    icon = 'question',
    danger = false,
  } = {}) {
    const result = await Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: danger ? DANGER_CONFIRM : BRAND_CONFIRM,
      cancelButtonColor: BRAND_CANCEL,
      reverseButtons: true,
      focusCancel: danger,
      buttonsStyling: true,
      customClass: {
        popup: 'star-health-alert',
        title: 'star-health-alert__title',
        htmlContainer: 'star-health-alert__text',
        confirmButton: 'star-health-alert__confirm',
        cancelButton: 'star-health-alert__cancel',
      },
    });

    return result.isConfirmed;
  },
};

export default notify;
