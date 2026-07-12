'use client';

import Link from 'next/link';
import {
  Calendar,
  ExternalLink,
  Eye,
  Pencil,
  Trash2,
  XCircle,
} from 'lucide-react';

const ACTION_CONFIG = {
  view: {
    label: 'View',
    Icon: Eye,
    variant: 'primary',
  },
  edit: {
    label: 'Edit',
    Icon: Pencil,
    variant: 'primary',
  },
  availability: {
    label: 'Availability',
    Icon: Calendar,
    variant: 'primary',
  },
  external: {
    label: 'View on site',
    Icon: ExternalLink,
    variant: 'muted',
  },
  cancel: {
    label: 'Cancel',
    Icon: XCircle,
    variant: 'danger',
  },
  delete: {
    label: 'Delete',
    Icon: Trash2,
    variant: 'danger',
  },
};

const VARIANT_CLASSES = {
  primary: 'admin-action-btn admin-action-btn--primary text-[#037B76] hover:bg-[#e6f4f2] focus-visible:ring-[#037B76]/30',
  danger: 'admin-action-btn admin-action-btn--danger text-red-600 hover:bg-red-50 focus-visible:ring-red-200',
  muted: 'admin-action-btn admin-action-btn--muted text-[#586971] hover:bg-[#f6f4f3] focus-visible:ring-[#d7e6e2]',
};

function getActionClasses(variant) {
  return `inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 ${VARIANT_CLASSES[variant]}`;
}

function ActionIcon({ action, className = '' }) {
  const config = ACTION_CONFIG[action];
  if (!config) return null;

  const { Icon } = config;
  return <Icon className={`h-4 w-4 ${className}`} strokeWidth={2} aria-hidden="true" />;
}

export function AdminActionButton({
  action,
  onClick,
  disabled = false,
  className = '',
}) {
  const config = ACTION_CONFIG[action];
  if (!config) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={config.label}
      aria-label={config.label}
      className={`${getActionClasses(config.variant)} disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      <ActionIcon action={action} />
    </button>
  );
}

export function AdminActionLink({
  action,
  href,
  external = false,
  className = '',
}) {
  const config = ACTION_CONFIG[action];
  if (!config || !href) return null;

  const classes = `${getActionClasses(config.variant)} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        title={config.label}
        aria-label={config.label}
        className={classes}
      >
        <ActionIcon action={action} />
      </a>
    );
  }

  return (
    <Link
      href={href}
      title={config.label}
      aria-label={config.label}
      className={classes}
    >
      <ActionIcon action={action} />
    </Link>
  );
}

export function AdminActionGroup({ children, className = '' }) {
  return <div className={`flex flex-wrap items-center gap-1 ${className}`}>{children}</div>;
}
