window.toggleSave = function(e, id) {
            e.stopPropagation();
            const video = videos.find(v => v.id === id);
            
            if (video) {
                // Chỉ copy nội dung ghi chú (note)
                const content = video.note;
                const btn = e.currentTarget;
                
                const showSuccess = () => {
                    playSound('success');
                    const originalSVG = btn.dataset.orig || btn.innerHTML;
                    if (!btn.dataset.orig) btn.dataset.orig = originalSVG;
                    
                    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>`;
                    btn.classList.add('scale-125', 'pointer-events-none');
                    
                    setTimeout(() => {
                        btn.innerHTML = originalSVG;
                        btn.classList.remove('scale-125', 'pointer-events-none');
                    }, 1500);
                };

                const fallbackCopy = (text) => {
                    const textArea = document.createElement("textarea");
                    textArea.value = text;
                    textArea.style.top = "0";
                    textArea.style.left = "0";
                    textArea.style.position = "fixed";
                    textArea.style.opacity = "0";
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    
                    try {
                        const successful = document.execCommand('copy');
                        if (successful) {
                            showSuccess();
                        } else {
                            prompt("Trình duyệt chặn copy ẩn, vui lòng copy thủ công (Ctrl+C):", text);
                        }
                    } catch (err) {
                        prompt("Trình duyệt chặn copy ẩn, vui lòng copy thủ công (Ctrl+C):", text);
                    }
                    document.body.removeChild(textArea);
                };

                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(content)
                        .then(showSuccess)
                        .catch(() => fallbackCopy(content));
                } else {
                    fallbackCopy(content);
                }
            }
        }