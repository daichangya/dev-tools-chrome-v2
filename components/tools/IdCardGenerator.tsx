import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../ui/Shared';
import { useI18n } from '../../i18n';

// Reference dimensions from the Python script (based on coordinates)
// Base width: 2000px (1500 photo x + 500 photo width = 2000)
const BASE_WIDTH = 2000;
// Base height: 3000px for stacked template (front + back)
const BASE_HEIGHT = 3000;

// Validation functions
const validateIdNumber = (id: string): boolean => {
  return /^\d{17}[\dXx]$/.test(id);
};

const validateDate = (year: string, month: string, day: string): boolean => {
  const y = parseInt(year, 10);
  const m = parseInt(month, 10);
  const d = parseInt(day, 10);
  
  if (isNaN(y) || isNaN(m) || isNaN(d)) return false;
  if (y < 1900 || y > 2100) return false;
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  
  // Check if date is valid (e.g., Feb 30 is invalid)
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
};

const validateLength = (text: string, maxLength: number): boolean => {
  return text.length <= maxLength;
}; 

export const IdCardGenerator = () => {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Form State
  const [name, setName] = useState('张三');
  const [gender, setGender] = useState('男');
  const [ethnicity, setEthnicity] = useState('汉');
  const [year, setYear] = useState('2000');
  const [month, setMonth] = useState('01');
  const [day, setDay] = useState('01');
  const [address, setAddress] = useState('北京市东城区景山前街4号');
  const [idNumber, setIdNumber] = useState('110101200001011234');
  
  // Back Side
  const [authority, setAuthority] = useState('北京市公安局东城分局');
  const [validity, setValidity] = useState('2020.01.01-2040.01.01');

  // Images
  const [photo, setPhoto] = useState<string | null>(null);
  // Default to absolute path for public folder assets
  const [template, setTemplate] = useState('/images/empty.jpg');
  
  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageError, setImageError] = useState<string | null>(null);
  
  // Validation state
  const validateField = useCallback((field: string, value: string) => {
    setErrors(prevErrors => {
      const newErrors: Record<string, string> = { ...prevErrors };
      
      switch (field) {
        case 'idNumber':
          if (value && !validateIdNumber(value)) {
            newErrors.idNumber = '身份证号必须是18位数字，最后一位可以是X';
          } else {
            delete newErrors.idNumber;
          }
          break;
        case 'year':
        case 'month':
        case 'day':
          // Validate date when all three fields are filled
          if (field === 'year' || field === 'month' || field === 'day') {
            const y = field === 'year' ? value : year;
            const m = field === 'month' ? value : month;
            const d = field === 'day' ? value : day;
            if (y && m && d && !validateDate(y, m, d)) {
              newErrors.date = '请输入有效的日期';
            } else {
              delete newErrors.date;
            }
          }
          break;
        case 'name':
          if (value && !validateLength(value, 20)) {
            newErrors.name = '姓名不能超过20个字符';
          } else {
            delete newErrors.name;
          }
          break;
        case 'address':
          if (value && !validateLength(value, 100)) {
            newErrors.address = '地址不能超过100个字符';
          } else {
            delete newErrors.address;
          }
          break;
      }
      
      return newErrors;
    });
  }, [year, month, day]);

  // Draw Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawContent = () => {
      // 1. Try to load the image
      const img = new Image();
      // Handle CORS for local development/extension
      img.crossOrigin = "Anonymous";
      
      const render = (isFallback = false) => {
        try {
          if (isFallback) {
             setImageError("模板图片加载失败，使用默认空白布局。请确保 public/images/empty.jpg 存在。");
             // Fallback Layout: 2000x3000 White Background
             canvas.width = BASE_WIDTH;
             canvas.height = BASE_HEIGHT;
             ctx.fillStyle = '#ffffff';
             ctx.fillRect(0, 0, canvas.width, canvas.height);
             
             // Draw helper lines for fallback
             ctx.strokeStyle = '#cccccc';
             ctx.lineWidth = 2;
             ctx.strokeRect(0, 0, canvas.width, canvas.height);
             
             // Split line
             ctx.beginPath();
             ctx.moveTo(0, canvas.height / 2);
             ctx.lineTo(canvas.width, canvas.height / 2);
             ctx.stroke();
             
             // Labels
             ctx.fillStyle = '#eeeeee';
             ctx.font = '100px sans-serif';
             ctx.textAlign = 'center';
             ctx.textBaseline = 'middle';
             ctx.fillText("FRONT SIDE", canvas.width / 2, canvas.height / 4);
             ctx.fillText("BACK SIDE", canvas.width / 2, (canvas.height / 4) * 3);
          } else {
             setImageError(null);
             canvas.width = img.naturalWidth;
             canvas.height = img.naturalHeight;
             ctx.drawImage(img, 0, 0);
          }

          // Calculate Scale Factor (Standard template width is ~2000px)
          const scale = canvas.width / BASE_WIDTH;
          
          // Draw text on top (works for both image and fallback)
          drawText(ctx, scale, canvas.height, canvas.width);
          
        } catch (error) {
          setImageError('渲染失败: ' + (error instanceof Error ? error.message : '未知错误'));
        }
      };

      if (template) {
        img.onerror = () => {
          console.warn(`Failed to load template at: ${template}. Switching to fallback rendering.`);
          render(true); // Render fallback
        };
        img.onload = () => render(false); // Render normal
        img.src = template;
      } else {
        render(true);
      }
    };

    const drawText = (ctx: CanvasRenderingContext2D, s: number, height: number, canvasWidth: number) => {
      const textColor = '#000000';
      ctx.fillStyle = textColor;
      // 使用 alphabetic 基线以获得更准确的垂直对齐
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'left';

      // 辅助函数：计算从 top 基线到 alphabetic 基线的垂直偏移量
      const getVerticalOffset = (fontSize: number): number => {
        return fontSize * 0.8;
      };

      // 辅助函数：获取文字的精确宽度
      const getTextWidth = (text: string, font: string): number => {
        ctx.font = font;
        return ctx.measureText(text).width;
      };

      // Font Definitions (Scaled)
      const fontSizeName = 72 * s;
      const fontSizeOther = 60 * s;
      const fontSizeBirth = 60 * s;
      const fontSizeId = 72 * s;

      const fontName = `bold ${fontSizeName}px "SimHei", sans-serif`;
      const fontOther = `bold ${fontSizeOther}px "SimHei", sans-serif`;
      const fontBirth = `bold ${fontSizeBirth}px "SimHei", sans-serif`; 
      const fontId = `bold ${fontSizeId}px "OCR-B", "SimHei", monospace`;

      // --- Front Side (Top Half) ---
      
      // Name: (630, 690)
      ctx.font = fontName;
      const nameY = 560 * s + getVerticalOffset(fontSizeName);
      ctx.fillText(name, 550 * s, nameY);

      // Gender: (630, 840)
      ctx.font = fontOther;
      const genderY = 690 * s + getVerticalOffset(fontSizeOther);
      ctx.fillText(gender, 550 * s, genderY);

      // Ethnicity/Nationality: (1030, 840)
      ctx.fillText(ethnicity, 1030 * s, genderY);

      // Birth: Year(630, 980), Month(950, 980), Day(1150, 980)
      ctx.font = fontBirth;
      const birthY = 790 * s + getVerticalOffset(fontSizeBirth);
      
      // Year
      const yearX = 530 * s;
      ctx.fillText(year, yearX, birthY);
      
      // Month
      const monthX = 750 * s;
      ctx.fillText(month, monthX, birthY);
      
      // Day
      const dayX = 950 * s;
      ctx.fillText(day, dayX, birthY);

      // Address: (630, 1120), line height 100, max 11 chars
      ctx.font = fontOther;
      const addrX = 550 * s;
      let addrY = 890 * s + getVerticalOffset(fontSizeOther);
      const lineHeight = 100 * s;
      
      let start = 0;
      while (start + 11 < address.length) {
         const line = address.substring(start, start + 11);
         ctx.fillText(line, addrX, addrY);
         start += 11;
         addrY += lineHeight;
      }
      ctx.fillText(address.substring(start), addrX, addrY);

      // ID Number: (950, 1475)
      ctx.font = fontId;
      const idY = 1175 * s + getVerticalOffset(fontSizeId);
      ctx.fillText(idNumber, 750 * s, idY);

      // Photo: (1500, 690), Size 500x670
      if (photo) {
        const pImg = new Image();
        pImg.onerror = () => {
          setImageError('照片加载失败，请重新上传');
        };
        pImg.src = photo;
        
        const drawPhoto = () => {
          try {
            ctx.drawImage(pImg, 1500 * s, 690 * s, 500 * s, 670 * s);
          } catch (error) {
            // silent fail for photo rendering
          }
        };

        if (pImg.complete) drawPhoto();
        else pImg.onload = drawPhoto;
      }

      // Back Side Info
      ctx.font = fontOther;
      const authorityY = 2190 * s + getVerticalOffset(fontSizeOther);
      const validityY = 2325 * s + getVerticalOffset(fontSizeOther);
      
      if (authorityY < height && validityY < height) {
        if (authority) ctx.fillText(authority, 950 * s, authorityY);
        if (validity) ctx.fillText(validity, 950 * s, validityY);
      }
    };

    drawContent();

  }, [name, gender, ethnicity, year, month, day, address, idNumber, photo, authority, validity, template]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setImageError('无法下载：Canvas未初始化');
      return;
    }
    
    try {
      const dataURL = canvas.toDataURL('image/jpeg', 0.8);
      if (!dataURL || dataURL === 'data:,') {
        setImageError('无法下载：图片数据为空');
        return;
      }
      
      const link = document.createElement('a');
      link.download = `id_${name || 'card'}.jpg`;
      link.href = dataURL;
      link.click();
    } catch (error) {
      setImageError('下载失败: ' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setImageError('请上传图片文件');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setImageError('图片文件大小不能超过5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImageError(null);
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTemplate(reader.result as string);
        setImageError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-row gap-6 h-full p-2">
      {/* Settings Panel */}
      <div className="w-80 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 pb-10">
        
        {/* Template Upload */}
        <div className="bg-space-900 border border-slate-700 rounded-lg p-3">
           <div className="flex justify-between items-center mb-2">
              <label className="text-xs text-slate-400 font-bold uppercase">{t('ui.idCardTemplate')}</label>
              <span className="text-[10px] text-slate-500 truncate max-w-[120px]" title={template}>
                {template.startsWith('data:') ? 'Custom Upload' : template}
              </span>
           </div>
           <div className="flex gap-3">
               <div className="relative group flex-1 bg-slate-800 border-2 border-dashed border-slate-600 rounded-md h-10 hover:border-cyan-500 hover:bg-slate-700 transition cursor-pointer flex items-center justify-center">
                  <span className="text-xs text-slate-400 group-hover:text-cyan-400">{t('ui.idCardUploadTemplate')}</span>
                  <input type="file" accept="image/*" onChange={handleTemplateUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
               </div>
           </div>
        </div>

        {/* Text Fields */}
        <div className="space-y-3">
           <div>
             <label className="text-xs text-slate-500 block mb-1">{t('ui.idCardName')}</label>
             <input 
               value={name} 
               onChange={e => {
                 const value = e.target.value;
                 setName(value);
                 validateField('name', value);
               }} 
               maxLength={20}
               className={`w-full bg-space-950 border rounded px-2 py-1.5 text-sm ${
                 errors.name ? 'border-red-500' : 'border-slate-700'
               }`} 
             />
             {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
           </div>
           
           <div className="flex gap-2">
             <div className="w-1/2">
               <label className="text-xs text-slate-500 block mb-1">{t('ui.idCardGender')}</label>
               <input value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-space-950 border border-slate-700 rounded px-2 py-1.5 text-sm" />
             </div>
             <div className="w-1/2">
               <label className="text-xs text-slate-500 block mb-1">{t('ui.idCardEthnicity')}</label>
               <input value={ethnicity} onChange={e => setEthnicity(e.target.value)} className="w-full bg-space-950 border border-slate-700 rounded px-2 py-1.5 text-sm" />
             </div>
           </div>

           <div className="flex gap-2 items-end">
              <div className="flex-1">
                 <label className="text-xs text-slate-500 block mb-1">{t('ui.idCardYear')}</label>
                 <input 
                   value={year} 
                   onChange={e => {
                     const value = e.target.value;
                     setYear(value);
                     validateField('year', value);
                   }} 
                   maxLength={4}
                   className={`w-full bg-space-950 border rounded px-2 py-1.5 text-sm ${
                     errors.date ? 'border-red-500' : 'border-slate-700'
                   }`} 
                 />
              </div>
              <div className="w-16">
                 <label className="text-xs text-slate-500 block mb-1">{t('ui.idCardMonth')}</label>
                 <input 
                   value={month} 
                   onChange={e => {
                     const value = e.target.value;
                     setMonth(value);
                     validateField('month', value);
                   }} 
                   maxLength={2}
                   className={`w-full bg-space-950 border rounded px-2 py-1.5 text-sm ${
                     errors.date ? 'border-red-500' : 'border-slate-700'
                   }`} 
                 />
              </div>
              <div className="w-16">
                 <label className="text-xs text-slate-500 block mb-1">{t('ui.idCardDay')}</label>
                 <input 
                   value={day} 
                   onChange={e => {
                     const value = e.target.value;
                     setDay(value);
                     validateField('day', value);
                   }} 
                   maxLength={2}
                   className={`w-full bg-space-950 border rounded px-2 py-1.5 text-sm ${
                     errors.date ? 'border-red-500' : 'border-slate-700'
                   }`} 
                 />
              </div>
           </div>
           {errors.date && <p className="text-xs text-red-400">{errors.date}</p>}

           <div>
             <label className="text-xs text-slate-500 block mb-1">{t('ui.idCardAddress')}</label>
             <textarea 
               value={address} 
               onChange={e => {
                 const value = e.target.value;
                 setAddress(value);
                 validateField('address', value);
               }} 
               rows={2} 
               maxLength={100}
               className={`w-full bg-space-950 border rounded px-2 py-1.5 text-sm resize-none ${
                 errors.address ? 'border-red-500' : 'border-slate-700'
               }`} 
             />
             {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address}</p>}
           </div>

           <div>
             <label className="text-xs text-slate-500 block mb-1">{t('ui.idCardNumber')}</label>
             <input 
               value={idNumber} 
               onChange={e => {
                 const value = e.target.value;
                 setIdNumber(value);
                 validateField('idNumber', value);
               }} 
               maxLength={18}
               className={`w-full bg-space-950 border rounded px-2 py-1.5 text-sm font-mono ${
                 errors.idNumber ? 'border-red-500' : 'border-slate-700'
               }`} 
             />
             {errors.idNumber && <p className="text-xs text-red-400 mt-1">{errors.idNumber}</p>}
           </div>

           {/* Back Side Info */}
           <div className="pt-2 border-t border-slate-800 mt-2">
               <h4 className="text-[10px] text-slate-600 font-bold uppercase mb-2">Back Side Info</h4>
               <div className="space-y-3">
                   <div>
                        <label className="text-xs text-slate-500 block mb-1">{t('ui.idCardAuthority')}</label>
                        <input value={authority} onChange={e => setAuthority(e.target.value)} className="w-full bg-space-950 border border-slate-700 rounded px-2 py-1.5 text-sm" />
                   </div>
                   <div>
                        <label className="text-xs text-slate-500 block mb-1">{t('ui.idCardValidity')}</label>
                        <input value={validity} onChange={e => setValidity(e.target.value)} className="w-full bg-space-950 border border-slate-700 rounded px-2 py-1.5 text-sm" />
                   </div>
               </div>
           </div>
        </div>

        {/* Photo Upload */}
        <div className="bg-space-900 border border-slate-700 rounded-lg p-3">
           <label className="text-xs text-slate-400 font-bold block mb-2 uppercase">{t('ui.idCardPhoto')}</label>
           <div className="flex gap-3">
               <div className="relative group flex-1 bg-slate-800 border-2 border-dashed border-slate-600 rounded-md h-20 hover:border-cyan-500 hover:bg-slate-700 transition cursor-pointer flex items-center justify-center">
                  <span className="text-xs text-slate-400 group-hover:text-cyan-400">{t('ui.idCardUploadPhoto')}</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
               </div>
               {photo && <img src={photo} className="w-16 h-20 object-cover rounded border border-slate-600" alt="Preview" />}
           </div>
        </div>
        
        {imageError && (
          <div className="bg-yellow-900/20 border border-yellow-800/50 p-2 rounded text-[10px] text-yellow-400">
             {imageError}
          </div>
        )}

        <Button onClick={handleDownload} className="mt-2">{t('common.download')}</Button>

      </div>

      {/* Preview Area */}
      <div className="flex-1 flex flex-col items-center justify-center bg-space-950/50 rounded-xl border border-slate-800 relative overflow-hidden p-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-space-950 to-black opacity-50 pointer-events-none"></div>
          
          <div className="relative shadow-2xl rounded-lg overflow-hidden border border-slate-700 flex items-center justify-center max-h-full max-w-full">
             {/* We use standard img styling max-h-full to ensure the large canvas scales down to fit the screen */}
             <canvas ref={canvasRef} className="bg-white block object-contain w-auto h-auto max-w-full max-h-full" />
          </div>
          
          <div className="mt-4 text-xs text-slate-500">
             * High Res Preview (Matches Template Size)
          </div>
      </div>
    </div>
  );
};