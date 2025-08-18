"use client";
import React from "react";

interface FilterOption {
  label: string;
  value: string;
  checked: boolean;
}

interface FilterSection {
  title: string;
  options: FilterOption[];
  type: "checkbox" | "radio";
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filterSections: FilterSection[];
  onFilterChange: (
    sectionIndex: number,
    optionIndex: number,
    checked: boolean,
  ) => void;
  onClearAll: () => void;
}

export default function FilterDrawer({
  isOpen,
  onClose,
  filterSections,
  onFilterChange,
  onClearAll,
}: FilterDrawerProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Filter Content */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 140px)" }}
        >
          {filterSections.map((section, sectionIndex) => (
            <div key={section.title} className="p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                {section.title}
              </h3>

              <div className="space-y-3">
                {section.options.map((option, optionIndex) => (
                  <label
                    key={option.value}
                    className="flex items-center cursor-pointer group"
                  >
                    <div className="relative">
                      <input
                        type={section.type}
                        name={
                          section.type === "radio" ? section.title : undefined
                        }
                        checked={option.checked}
                        onChange={(e) =>
                          onFilterChange(
                            sectionIndex,
                            optionIndex,
                            e.target.checked,
                          )
                        }
                        className="sr-only"
                      />

                      {/* Custom checkbox/radio */}
                      <div
                        className={`w-5 h-5 border-2 rounded transition-all duration-200 ${
                          section.type === "radio" ? "rounded-full" : "rounded"
                        } ${
                          option.checked
                            ? "bg-purple-500 border-purple-500"
                            : "border-gray-500 group-hover:border-gray-400"
                        }`}
                      >
                        {option.checked && (
                          <div
                            className={`w-full h-full flex items-center justify-center ${
                              section.type === "radio"
                                ? "rounded-full"
                                : "rounded"
                            }`}
                          >
                            {section.type === "radio" ? (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            ) : (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="ml-3 text-gray-300 group-hover:text-white transition-colors">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <button
            onClick={onClearAll}
            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  );
}
