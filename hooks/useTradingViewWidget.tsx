'use client';
import { useEffect, useRef } from "react";

const useTradingViewWidget = (scriptUrl: string, config: Record<string, unknown>, height = 600) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        if (containerRef.current.dataset.loaded) return;

        // Clear previous content
        containerRef.current.innerHTML = '';

        // Create the widget container
        const widgetDiv = document.createElement("div");
        widgetDiv.className = "tradingview-widget-container__widget";
        widgetDiv.style.width = "100%";
        widgetDiv.style.height = `${height}px`;

        // Create script tag with config
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = scriptUrl;
        script.async = true;
        
        // Set config as text content, properly stringified
        script.textContent = JSON.stringify(config);

        // Append both elements
        containerRef.current.appendChild(widgetDiv);
        containerRef.current.appendChild(script);
        
        containerRef.current.dataset.loaded = 'true';

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
                delete containerRef.current.dataset.loaded;
            }
        }
    }, [scriptUrl, config, height]);

    return containerRef;
}

export default useTradingViewWidget;
