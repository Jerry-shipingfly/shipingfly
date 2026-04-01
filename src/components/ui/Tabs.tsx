import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/utils/helpers';

/**
 * Tab项数据结构
 */
export interface TabItem {
  /** 标签唯一键 */
  key: string;
  /** 标签显示文本 */
  label: React.ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
  /** 图标 */
  icon?: React.ReactNode;
  /** 徽标 */
  badge?: React.ReactNode;
}

/**
 * Tabs组件的Props接口
 */
export interface TabsProps {
  /** 标签列表 */
  items: TabItem[];
  /** 当前激活的标签键（受控模式） */
  activeKey?: string;
  /** 默认激活的标签键（非受控模式） */
  defaultActiveKey?: string;
  /** 标签切换回调 */
  onChange?: (activeKey: string) => void;
  /** 布局方向 */
  direction?: 'horizontal' | 'vertical';
  /** 标签位置（仅水平方向） */
  position?: 'left' | 'center' | 'right';
  /** 标签页内容 */
  children?: React.ReactNode;
  /** 扩展样式类名 */
  className?: string;
  /** 标签栏样式类名 */
  tabClassName?: string;
  /** 内容区样式类名 */
  contentClassName?: string;
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * TabsContext
 */
interface TabsContextValue {
  activeKey: string;
  onChange: (key: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

/**
 * Size style mapping
 */
const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-5 py-2.5',
};

/**
 * 通用标签切换组件
 * @description 支持受控/非受控模式、水平/垂直布局、图标、徽标等功能
 *
 * @example
 * // 基础用法
 * const items = [
 *   { key: 'tab1', label: '标签1' },
 *   { key: 'tab2', label: '标签2' },
 * ];
 *
 * <Tabs
 *   items={items}
 *   activeKey={activeKey}
 *   onChange={setActiveKey}
 * >
 *   <TabContent tabKey="tab1">内容1</TabContent>
 *   <TabContent tabKey="tab2">内容2</TabContent>
 * </Tabs>
 */
export const Tabs: React.FC<TabsProps> = ({
  items,
  activeKey: controlledActiveKey,
  defaultActiveKey,
  onChange,
  direction = 'horizontal',
  position = 'left',
  children,
  className,
  tabClassName,
  contentClassName,
  size = 'md',
}) => {
  // 内部状态（非受控模式）
  const [internalActiveKey, setInternalActiveKey] = useState<string>(
    defaultActiveKey || items[0]?.key || ''
  );

  // 实际激活的标签
  const activeKey = controlledActiveKey ?? internalActiveKey;

  // 处理标签切换
  const handleChange = (key: string) => {
    if (controlledActiveKey === undefined) {
      setInternalActiveKey(key);
    }
    onChange?.(key);
  };

  const isVertical = direction === 'vertical';

  return (
    <TabsContext.Provider value={{ activeKey, onChange: handleChange }}>
      <div
        className={cn(
          'flex',
          isVertical ? 'flex-row' : 'flex-col',
          className
        )}
      >
        {/* 标签栏 */}
        <div
          className={cn(
            isVertical
              ? 'flex flex-col border-r border-gray-200 pr-4'
              : cn(
                  'bg-white rounded-xl border border-gray-200 p-2 flex gap-1',
                  position === 'center' && 'justify-center',
                  position === 'right' && 'justify-end'
                ),
            tabClassName
          )}
          role="tablist"
          aria-orientation={direction}
        >
          {items.map((item) => {
            const isActive = activeKey === item.key;
            return (
              <button
                key={item.key}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${item.key}`}
                tabIndex={isActive ? 0 : -1}
                disabled={item.disabled}
                className={cn(
                  // 布局
                  'flex items-center gap-2',
                  // 盒模型
                  isVertical ? 'rounded-md' : 'rounded-lg',
                  sizeStyles[size],
                  // 交互
                  'transition-colors duration-200',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                  // 状态
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  isVertical
                    ? cn(
                        'justify-start',
                        isActive
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      )
                    : cn(
                        isActive
                          ? 'bg-primary-500 text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      ),
                  // 用户自定义样式
                  className
                )}
                onClick={() => !item.disabled && handleChange(item.key)}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
                {item.badge && <span className="flex-shrink-0">{item.badge}</span>}
              </button>
            );
          })}
        </div>

        {/* 内容区 */}
        <div
          className={cn(
            isVertical ? 'flex-1 pl-4' : 'pt-4',
            contentClassName
          )}
        >
          {children}
        </div>
      </div>
    </TabsContext.Provider>
  );
};

/**
 * TabContent组件的Props接口
 */
export interface TabContentProps {
  /** 对应的标签键 */
  tabKey: string;
  /** 子元素 */
  children: React.ReactNode;
  /** 扩展样式类名 */
  className?: string;
}

/**
 * 标签页内容组件
 * @description 用于包裹每个标签页的内容
 */
export const TabContent: React.FC<TabContentProps> = ({
  tabKey,
  children,
  className,
}) => {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('TabContent must be used within Tabs');
  }

  const { activeKey } = context;

  if (activeKey !== tabKey) {
    return null;
  }

  return (
    <div
      id={`tabpanel-${tabKey}`}
      role="tabpanel"
      aria-labelledby={tabKey}
      tabIndex={0}
      className={cn('focus:outline-none', className)}
    >
      {children}
    </div>
  );
};

export default Tabs;
