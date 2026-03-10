import { Skeleton } from 'antd'
import React from 'react'

export default function SkeletonProfile() {
  return (
    <div className="flex flex-col gap-4">
            {/* AVATAR */}
            <Skeleton.Avatar active size={96} shape="circle" className="mx-auto" />

            {/* NICKNAME */}
            <Skeleton.Input active size="default" style={{ width: "100%" }} />

            {/* EMAIL */}
            <Skeleton.Input active size="default" style={{ width: "100%" }} />

            {/* BIO */}
            <Skeleton.Input active size="large" style={{ width: "100%", height: 96 }} />

            {/* BUTTONS */}
            <div className="flex flex-col gap-3 mt-4">
              <Skeleton.Button active size="default" block />
              <Skeleton.Button active size="default" block />
            </div>
          </div>
  )
}
