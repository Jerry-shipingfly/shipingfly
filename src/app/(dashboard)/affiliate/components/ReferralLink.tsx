'use client';

import React, { useState } from 'react';
import { Copy, Check, Share2, QrCode, ExternalLink } from 'lucide-react';
import { Button, Modal } from '@/components/ui';
import { copyToClipboard, cn } from '@/utils/helpers';

/**
 * ReferralLink组件的Props接口
 */
export interface ReferralLinkProps {
  /** 推荐链接 */
  link: string;
  /** 推荐码 */
  code: string;
  /** 自定义样式 */
  className?: string;
}

/**
 * 推荐链接组件
 * @description 展示推荐链接，支持复制和分享功能
 */
export const ReferralLink: React.FC<ReferralLinkProps> = ({
  link,
  code,
  className,
}) => {
  const [copied, setCopied] = useState<'link' | 'code' | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  // 复制链接
  const handleCopyLink = async () => {
    const success = await copyToClipboard(link);
    if (success) {
      setCopied('link');
      setTimeout(() => setCopied(null), 2000);
    }
  };

  // 复制推荐码
  const handleCopyCode = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied('code');
      setTimeout(() => setCopied(null), 2000);
    }
  };

  // 社交分享
  const handleShare = (platform: 'facebook' | 'twitter') => {
    const text = '使用我的推荐链接注册 HyperZone，享受专属优惠！';
    let shareUrl = '';

    if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* 推荐码 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          推荐码
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-4 py-3 bg-gray-100 rounded-lg font-mono text-lg font-semibold text-gray-900">
            {code}
          </div>
          <Button
            variant="secondary"
            onClick={handleCopyCode}
            leftIcon={copied === 'code' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          >
            {copied === 'code' ? '已复制' : '复制'}
          </Button>
        </div>
      </div>

      {/* 推荐链接 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          推荐链接
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-4 py-3 bg-gray-100 rounded-lg text-sm text-gray-700 truncate">
            {link}
          </div>
          <Button
            variant="secondary"
            onClick={handleCopyLink}
            leftIcon={copied === 'link' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          >
            {copied === 'link' ? '已复制' : '复制'}
          </Button>
        </div>
      </div>

      {/* 分享按钮 */}
      <div className="flex items-center gap-3 pt-2">
        <span className="text-sm text-gray-500">分享到：</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare('facebook')}
          leftIcon={<ExternalLink className="w-4 h-4 text-blue-600" />}
        >
          Facebook
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare('twitter')}
          leftIcon={<Share2 className="w-4 h-4 text-sky-500" />}
        >
          Twitter
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowQRModal(true)}
          leftIcon={<QrCode className="w-4 h-4" />}
        >
          二维码
        </Button>
      </div>

      {/* 二维码弹窗 */}
      <Modal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title="推荐链接二维码"
        size="sm"
      >
        <div className="text-center py-4">
          {/* 模拟二维码 - 实际项目中应使用真实二维码库 */}
          <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
            <QrCode className="w-24 h-24 text-gray-400" />
          </div>
          <p className="mt-4 text-sm text-gray-500">
            扫描二维码访问推荐链接
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ReferralLink;
