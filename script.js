window.toggleSave = function(e, id) {
            e.stopPropagation();
            const video = videos.find(v => v.id === id);
            
            if (video) {
                const content = video.note; // Chỉ sao chép đúng ghi chú
                
                const handleSuccess = () => {
                    playSound('success');
                    const btn = e.currentTarget;
                    const originalSVG = btn.dataset.orig || btn.innerHTML;
                    if (!btn.dataset.orig) btn.dataset.orig = originalSVG;
                    
                    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>`;
                    btn.classList.add('scale-125', 'pointer-events-none');
                    
                    setTimeout(() => {
                        btn.innerHTML = originalSVG;
                        btn.classList.remove('scale-125', 'pointer-events-none');
                    }, 1500);
                };

                const handleError = (err) => {
                    console.error('Không thể copy: ', err);
                    alert("Trình duyệt không hỗ trợ copy tự động, vui lòng thử lại hoặc copy thủ công!");
                };

                // Fallback tương thích mọi trình duyệt
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(content).then(handleSuccess).catch(handleError);
                } else {
                    try {
                        const textArea = document.createElement("textarea");
                        textArea.value = content;
                        textArea.style.position = "fixed";
                        textArea.style.left = "-9999px";
                        document.body.appendChild(textArea);
                        textArea.select();
                        const successful = document.execCommand('copy');
                        document.body.removeChild(textArea);
                        
                        if (successful) {
                            handleSuccess();
                        } else {
                            handleError('execCommand failed');
                        }
                    } catch (err) {
                        handleError(err);
                    }
                }
            }
        }