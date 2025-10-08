'use client'

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  MoreHorizontal,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import LogoSvg from '../assets/svg/LogoSvg';
import GridSvg from '@/assets/svg/grid-01';
import MailSvg from '@/assets/svg/mail-02';
import BuildingSvg from '@/assets/svg/building-05';
import UsersSvg from '@/assets/svg/users-03';
import AnnouncementSvg from '@/assets/svg/announcement-02';
import BankNoteSvg from '@/assets/svg/bank-note-02';
import { useRouter } from 'next/navigation';
import SettingsSvg from '@/assets/svg/settings';

interface SidebarProps {
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: string;
  dropdown?: boolean;
  hoverPanel?: boolean;
  subItems?:
  {
    name: string,
    icon: React.ComponentType<{ className?: string }>;
    link?: string;
  }[] | string[];
  link?: string;
}

const Sidebar = ({ onClose, isCollapsed = false, onToggleCollapse }: SidebarProps) => {
  const router = useRouter();
  const menuItems: MenuItem[] = [
    { icon: GridSvg, label: 'Dashboard', link: '/' },
    { icon: MailSvg, label: 'My action items', badge: '0', link: '#' },
    {
      icon: AnnouncementSvg,
      label: 'Requisitions',
      dropdown: true,
      subItems: ['Create Requisition', 'View Requisitions', 'Pending Approvals', 'Requisition History'],
      link: '#'
    },
    {
      icon: BuildingSvg,
      label: 'Vendor management',
      hoverPanel: true,
      subItems: [
        {
          name: 'Onboarding',
          link: '/vendor-management/vendor-onboarding',
          icon: () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 7H10.25M7.5 11H10.25M7.5 15H10.25M13.75 7H16.5M13.75 11H16.5M13.75 15H16.5M20 21V6.2C20 5.0799 20 4.51984 19.782 4.09202C19.5903 3.71569 19.2843 3.40973 18.908 3.21799C18.4802 3 17.9201 3 16.8 3H7.2C6.07989 3 5.51984 3 5.09202 3.21799C4.71569 3.40973 4.40973 3.71569 4.21799 4.09202C4 4.51984 4 5.0799 4 6.2V21M22 21H2" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          ),
        },
        {
          name: 'Directory',
          link: '/vendor-management/vendor-directory',
          icon: () => (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 2H5.8C4.11984 2 3.27976 2 2.63803 2.32698C2.07354 2.6146 1.6146 3.07354 1.32698 3.63803C1 4.27976 1 5.11984 1 6.8V14.2C1 15.8802 1 16.7202 1.32698 17.362C1.6146 17.9265 2.07354 18.3854 2.63803 18.673C3.27976 19 4.11984 19 5.8 19H13.2C14.8802 19 15.7202 19 16.362 18.673C16.9265 18.3854 17.3854 17.9265 17.673 17.362C18 16.7202 18 15.8802 18 14.2V11M11 15H5M13 11H5M18.1213 1.87868C19.2929 3.05025 19.2929 4.94975 18.1213 6.12132C16.9497 7.29289 15.0503 7.29289 13.8787 6.12132C12.7071 4.94975 12.7071 3.05025 13.8787 1.87868C15.0503 0.707107 16.9497 0.707107 18.1213 1.87868Z" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          ),
        },
        {
          name: 'Insights',
          link: '/vendor-management/vendor-insights',
          icon: () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 15V17M12 11V17M16 7V17M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          ),
        }
      ],
      link: '#'
    },
    {
      icon: UsersSvg,
      label: 'Workforce tracking',
      dropdown: true,
      subItems: ['Employee Directory', 'Time Tracking', 'Performance Reviews', 'Training Records'],
      link: '#'
    },
    {
      icon: BankNoteSvg,
      label: 'Finances',
      dropdown: true,
      subItems: ['Budget Overview', 'Expense Reports', 'Invoice Management', 'Financial Reports'],
      link: '#'
    }
  ];

  const [activeItem, setActiveItem] = useState(menuItems[0].label);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleDropdown = (label: string) => {
    setOpenDropdowns(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isDropdownOpen = (label: string) => {
    return openDropdowns.includes(label);
  };

  const handleItemMouseEnter = (item: MenuItem) => {
    if (isMobile) return; // Skip hover on mobile

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    if (item.hoverPanel && (!isCollapsed || isHovered)) {
      setHoveredItem(item.label);
    }
  };

  const handleItemMouseLeave = (item: MenuItem) => {
    if (isMobile) return; // Skip hover on mobile

    if (item.hoverPanel) {
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredItem(null);
      }, 150); // Small delay to allow moving to hover panel
    }
  };

  const handleItemTouch = (item: MenuItem) => {
    if (!isMobile) return; // Only handle touch on mobile

    if (item.hoverPanel) {
      if (hoveredItem === item.label) {
        setHoveredItem(null); // Close if already open
      } else {
        setHoveredItem(item.label); // Open the panel
      }
    }
  };

  const handlePanelMouseEnter = (itemLabel: string) => {
    if (isMobile) return; // Skip hover on mobile

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredItem(itemLabel);
  };

  const handlePanelMouseLeave = () => {
    if (isMobile) return; // Skip hover on mobile

    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
    }, 150);
  };

  // Mobile detection and cleanup
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <div
        className={`h-screen flex flex-col  overflow-y-auto scrollbar-none bg-[#7F56D9] transition-all duration-300 ease-in-out ${isCollapsed && !isHovered ? 'w-[70px]' : 'lg:w-[255px] w-[255px] max-w-[255px]'
          }`}
        onMouseEnter={() => {
          if (isCollapsed) {
            setIsHovered(true);
          }
        }}
        onMouseLeave={() => {
          if (isCollapsed) {
            setIsHovered(false);
          }
        }}
      >
        {/* Header with Logo and Collapse Button */}
        <div className={`${isCollapsed && !isHovered ? 'px-2' : 'px-4'} pb-4 pt-4`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            {(!isCollapsed || isHovered) && (
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
                <LogoSvg width={49} height={32} color="white" />
                <span className="text-white font-normal text-2xl">
                  VMS
                </span>
              </div>
            )}

            {/* Mobile close button and collapse toggle */}
            <div className="flex items-center space-x-2">
              <button
                className="h-[32px] w-[32px] flex items-center justify-center hover:opacity-80 transition-opacity lg:hidden"
                onClick={onClose}
              >
                <X className="w-4 h-4 text-white" />
              </button>
              {onToggleCollapse && (
                <button
                  className="h-[32px] w-[32px] flex items-center justify-center hover:opacity-80 transition-opacity"
                  onClick={onToggleCollapse}
                >
                  {isCollapsed ? (
                    isHovered ? (
                      <ChevronLeft className="w-4 h-4 text-white" />
                    ) : (
                      <LogoSvg width={49} height={32} color="white" />
                    )
                  ) : (
                    <ChevronLeft className="w-4 h-4 text-white" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className={`flex-1 ${isCollapsed && !isHovered ? 'px-1' : 'px-2'} mt-4`}>
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  className={`w-full h-[40px] gap-2 rounded-md ${isCollapsed && !isHovered ? 'px-2 justify-center' : 'px-3'} py-2 flex items-center text-sm transition-all duration-200 text-white/80 hover:text-white hover:bg-[#6941C6] cursor-pointer ${activeItem === item.label ? 'bg-[#6941C6] text-white' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.dropdown && (!isCollapsed || isHovered)) {
                      toggleDropdown(item.label);
                    } else {
                      setActiveItem(item.label);
                      // Close sidebar on mobile when item is clicked
                      if (onClose) {
                        onClose();
                      }
                      if (item.link) {
                        router.push(item.link);
                      }
                    }
                  }}
                  onMouseEnter={() => handleItemMouseEnter(item)}
                  onMouseLeave={() => handleItemMouseLeave(item)}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleItemTouch(item);
                  }}
                  title={isCollapsed && !isHovered ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {(!isCollapsed || isHovered) && (
                    <>
                      <span className="flex-1 font-[500] text-[14px] text-white">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="bg-white text-purple rounded-[100px] w-[35px] border border-gray-300 shadow-sm px-2 py-1 text-xs font-[600] text-center min-w-[20px]">
                          {item.badge}
                        </span>
                      )}
                      {item.dropdown && (
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen(item.label) ? 'rotate-180' : ''}`} />
                      )}
                    </>
                  )}
                </a>

                {/* Dropdown Content */}
                {item.dropdown && item.subItems && (!isCollapsed || isHovered) && (
                  <div
                    className={`ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${isDropdownOpen(item.label)
                      ? 'max-h-96 opacity-100'
                      : 'max-h-0 opacity-0'
                      }`}
                  >
                    {item.subItems.map((subItem, subIndex) => {
                      const subItemName = typeof subItem === 'string' ? subItem : subItem.name;
                      return (
                        <a
                          key={subIndex}
                          href="#"
                          className="block px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-[#6941C6] rounded-md transition-all duration-200"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveItem(`${item.label} - ${subItemName}`);
                            if (onClose) onClose();
                          }}
                        >
                          {subItemName}
                        </a>
                      );
                    })}
                  </div>
                )}

                {/* HR line after My action items */}
                {item.label === 'My action items' && (
                  <hr
                    className="w-full h-0 border-t border-[#6941C6] bottom-2 opacity-100 my-2 mx-auto"
                  />
                )}
              </li>
            ))}

          </ul>
        </nav>

        {/* User Profile */}
        <div className={`${isCollapsed && !isHovered ? 'flex flex-col items-center' : 'px-4'} py-6 gap-4 flex flex-col `}>
          <div className="flex py-2 cursor-pointer items-center  text-[16px] font-[500] gap-2 text-white/70 hover:text-white hover:bg-[#6941C6] rounded-md transition-all duration-200"
          // onClick={() => router.push('/settings')}
          >
            <SettingsSvg color='white' />
            {(!isCollapsed || isHovered) && <span >Settings</span>}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop&crop=face"
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              {(!isCollapsed || isHovered) && <span className="text-white font-medium text-sm">Subramanyam</span>}
            </div>
            {(!isCollapsed || isHovered) &&
              <button
                className="h-[32px] w-[32px] flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <MoreHorizontal className="w-4 h-4 text-white" />
              </button>
            }
          </div>
        </div>
      </div>

      {/* Dynamic Hover Panels */}
      {menuItems.map((item) => {
        if (item.hoverPanel && hoveredItem === item.label) {
          return (
            <div key={item.label}>
              {/* Mobile backdrop */}
              {isMobile && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={() => setHoveredItem(null)}
                />
              )}

              <div
                className={`absolute ${isMobile
                  ? 'left-0 top-0 w-full h-screen'
                  : `${isCollapsed && !isHovered ? 'left-[70px]' : 'left-[255px]'} top-0 w-[280px] h-screen`
                  } bg-white shadow-2xl z-50 border-l border-gray-200 transition-all duration-300 ease-in-out transform translate-x-0 opacity-100`}
                onMouseEnter={() => handlePanelMouseEnter(item.label)}
                onMouseLeave={handlePanelMouseLeave}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[16px] font-[500] text-[#101828]">{item.label}</h2>
                    {isMobile && (
                      <button
                        onClick={() => setHoveredItem(null)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {item.subItems?.map((subItem: any, index: number) => {
                      const SubItemIcon = subItem.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => {
                            if (subItem.link) {
                              router.push(subItem.link);
                            }
                            setActiveItem(`${item.label} - ${subItem.name}`);
                            setHoveredItem(null);
                            // Close sidebar on mobile after navigation
                            if (isMobile && onClose) {
                              onClose();
                            }
                          }}
                        >
                          <div className={`w-8 h-8  rounded-lg flex items-center justify-center`}>
                            <SubItemIcon />
                          </div>
                          <span className="text-[14px] font-[600] text-[#344054]">{subItem.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default Sidebar;