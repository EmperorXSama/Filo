import type { RoadmapConfig } from '@/types/roadmap'

export const roadmapConfig: RoadmapConfig = {
  phases: [
    {
      id: 'foundation',
      title: 'Foundation',
      version: 'v0.1',
      status: 'in-development',
      features: [
        {
          id: 'spaces',
          title: 'Spaces',
          description:
            'Create your own private spaces and invite people by email. Each space is yours to manage — you control who gets in, what gets uploaded, and what gets shared.',
          status: 'in-development',
          icon: 'Folder',
        },
        {
          id: 'membership-role',
          title: 'Membership & Role System',
          description:
            'Define roles within each space — owners control everything, members can view and download. Fine-grained permissions for every action.',
          status: 'in-development',
          icon: 'UserCheck',
        },
        {
          id: 'invitation-system',
          title: 'Invitation System',
          description:
            'Invite anyone on the platform to join your space. They will receive an in-app notification and can accept or decline on their own terms.',
          status: 'in-development',
          icon: 'MailPlus',
        },
        {
          id: 'notifications',
          title: 'In-App Notification Center',
          description:
            'Real-time notifications for invitations, uploads, and activity in your spaces. Stay informed without email noise.',
          status: 'in-development',
          icon: 'Bell',
        },
      ],
    },
    {
      id: 'file-management',
      title: 'File Management',
      version: 'v0.2',
      status: 'planned',
      features: [
        {
          id: 'file-uploads',
          title: 'File Uploads',
          description:
            'Upload documents, images, and files directly into your spaces. Owners have full control over what lives in a space.',
          status: 'planned',
          icon: 'Upload',
        },
        {
          id: 'video-uploads',
          title: 'Video Uploads & Streaming',
          description:
            'Upload and stream video content directly in the browser. Built-in player with support for common formats.',
          status: 'planned',
          icon: 'Video',
        },
        {
          id: 'upload-lifecycle',
          title: 'Upload Lifecycle & Cancellation',
          description:
            'Track upload progress with the ability to pause, resume, or cancel. Reliable handling for large files.',
          status: 'planned',
          icon: 'RefreshCw',
        },
        {
          id: 'file-validation',
          title: 'File Validation Pipeline',
          description:
            'Every file goes through a validation pipeline. We verify file types at the byte level and enforce strict format rules.',
          status: 'planned',
          icon: 'Shield',
        },
        {
          id: 'storage-quotas',
          title: 'Storage Quotas',
          description:
            'Every account comes with a dedicated storage allowance. The platform tracks your usage in real time.',
          status: 'planned',
          icon: 'HardDrive',
        },
        {
          id: 'file-categories',
          title: 'File Categories',
          description:
            'Organize files into custom categories within each space. Filter and sort by type, date, or category.',
          status: 'planned',
          icon: 'Tags',
        },
      ],
    },
    {
      id: 'member-experience',
      title: 'Member Experience',
      version: 'v0.3',
      status: 'planned',
      features: [
        {
          id: 'space-dashboard',
          title: 'Space Dashboard',
          description:
            'A dedicated dashboard for each space showing recent activity, storage usage, member list, and quick actions.',
          status: 'planned',
          icon: 'LayoutDashboard',
        },
        {
          id: 'file-downloads',
          title: 'File Downloads',
          description:
            'Download files shared in your spaces. Members can view and download everything available to them.',
          status: 'planned',
          icon: 'Download',
        },
        {
          id: 'member-directory',
          title: 'Member Directory',
          description:
            'See who is in each space, their roles, and when they joined. Easily manage membership from one place.',
          status: 'planned',
          icon: 'Users',
        },
        {
          id: 'owner-controls',
          title: 'Owner Controls',
          description:
            'Space owners have full administrative control — manage members, moderate content, and configure space settings.',
          status: 'planned',
          icon: 'Settings',
        },
      ],
    },
    {
      id: 'audit-transparency',
      title: 'Audit & Transparency',
      version: 'v0.4',
      status: 'planned',
      features: [
        {
          id: 'audit-trail',
          title: 'Full Audit Trail',
          description:
            'Every download, every upload, every access — logged. Space owners have visibility into how their content is being used.',
          status: 'planned',
          icon: 'ClipboardList',
        },
        {
          id: 'download-analytics',
          title: 'Download Analytics',
          description:
            'Track who downloaded what and when. Understand usage patterns with detailed download metrics.',
          status: 'planned',
          icon: 'BarChart3',
        },
        {
          id: 'stream-analytics',
          title: 'Stream Analytics',
          description:
            'Monitor video streaming activity — watch time, viewer counts, and popular content.',
          status: 'planned',
          icon: 'Activity',
        },
        {
          id: 'upload-history',
          title: 'Upload History',
          description:
            'Complete history of all uploads across spaces with metadata, timestamps, and uploader information.',
          status: 'planned',
          icon: 'History',
        },
      ],
    },
    {
      id: 'future-vision',
      title: 'Future Vision',
      version: 'v0.5',
      status: 'future',
      features: [
        {
          id: 'storage-upgrades',
          title: 'Storage Plan Upgrades',
          description:
            'Upgrade your storage plan as your needs grow. Flexible tiers for individuals and teams.',
          status: 'future',
          icon: 'ArrowUpCircle',
        },
        {
          id: 'space-storage-visibility',
          title: 'Space Storage Visibility',
          description:
            'See exactly how much storage each space consumes. Make informed decisions about content management.',
          status: 'future',
          icon: 'Eye',
        },
        {
          id: 'file-versioning',
          title: 'File Versioning',
          description:
            'Keep a history of file changes. Access previous versions and restore them when needed.',
          status: 'future',
          icon: 'GitBranch',
        },
        {
          id: 'invitation-expiry',
          title: 'Invitation Expiry',
          description:
            'Set expiration dates on invitations. Control how long invites remain valid for enhanced security.',
          status: 'future',
          icon: 'Timer',
        },
        {
          id: 'space-archiving',
          title: 'Space Archiving',
          description:
            'Archive inactive spaces to keep your workspace clean while preserving data for future reference.',
          status: 'future',
          icon: 'Archive',
        },
        {
          id: 'activity-feed',
          title: 'Activity Feed',
          description:
            'A unified activity feed across all your spaces. Never miss important updates.',
          status: 'future',
          icon: 'Rss',
        },
      ],
    },
  ],

  liveFeatures: [
    {
      id: 'authentication',
      title: 'Authentication & Identity',
      description:
        'Secure authentication powered by Auth0. Login with email or social providers. Your identity is protected.',
      status: 'live',
      icon: 'Lock',
    },
    {
      id: 'platform-architecture',
      title: 'Platform Architecture',
      description:
        'Modern cloud-native platform built on .NET, React, and Docker. Scalable, secure, and continuously deployed.',
      status: 'live',
      icon: 'Server',
    },
  ],

  edges: [
    { id: 'e-auth-spaces', source: 'authentication', target: 'spaces' },
    { id: 'e-spaces-membership', source: 'spaces', target: 'membership-role' },
    { id: 'e-membership-invitation', source: 'membership-role', target: 'invitation-system' },
    { id: 'e-invitation-notifications', source: 'invitation-system', target: 'notifications' },

    { id: 'e-spaces-files', source: 'spaces', target: 'file-uploads' },
    { id: 'e-files-video', source: 'file-uploads', target: 'video-uploads' },
    { id: 'e-video-storage', source: 'video-uploads', target: 'storage-quotas' },
    { id: 'e-files-validation', source: 'file-uploads', target: 'file-validation' },

    { id: 'e-spaces-dashboard', source: 'spaces', target: 'space-dashboard' },
    { id: 'e-dashboard-downloads', source: 'space-dashboard', target: 'file-downloads' },
    { id: 'e-downloads-audit', source: 'file-downloads', target: 'audit-trail' },
    { id: 'e-downloads-analytics', source: 'file-downloads', target: 'download-analytics' },
  ],
}
