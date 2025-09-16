import { QRCodeSVG } from 'qrcode.react';
import React from 'react';

type QrCodeProps = {
  value: string;
  svgRef?: React.Ref<SVGSVGElement>;
};

export const QrCode: React.FC<QrCodeProps> = ({ value, svgRef }) => (
  <div className="flex justify-center items-center">
    <QRCodeSVG value={value} size={64} ref={svgRef} />
  </div>
);
