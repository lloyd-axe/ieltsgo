import { useEffect } from 'react';

const GoogleAdHorizontal = ({ adKey, min_height = "15%" }) => {
    useEffect(() => {
        if (typeof window !== "undefined" && window.adsbygoogle) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error('AdSense error:', e);
            }
        }
    }, []);

    return (
        <div className="ad-container-h" style={{minHeight: min_height}}>
            <ins key={adKey}
                className="adsbygoogle"
                style={{ display: 'block', width: '100%'}}
                data-ad-client="ca-pub-8259864598528617"
                data-ad-slot="8286711790"
                data-ad-format=""
                data-full-width-responsive="true">
            </ins>
        </div>
    );
};

const GoogleAdVertical = ({ adKey }) => {
    useEffect(() => {
        if (typeof window !== "undefined" && window.adsbygoogle && !window.adsbygoogle.loaded) {
            try {
                window.adsbygoogle.loaded = true;
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error('AdSense error:', e);
            }
        }
        return () => {
            delete window.adsbygoogle.loaded;
        };
    }, []);

    return (
        <div className="ad-container-h">
            <ins key={adKey}
                className="adsbygoogle"
                style={{ display: 'block', width: '100%', height: '90px' }}
                data-ad-client="ca-pub-8259864598528617"
                data-ad-slot="4079841651"
                data-ad-format=""
                data-full-width-responsive="true">
            </ins>
        </div>
    );
};

const GoogleAdArticle = ({ adKey }) => {
    useEffect(() => {
        if (typeof window !== "undefined" && window.adsbygoogle) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error('AdSense error:', e);
            }
        }
    }, []);

    return (
        <div className="ad-container-a">
            <ins key={adKey}
                className="adsbygoogle"
                style={{ display: 'block', textAlign: 'center' }}
                data-ad-client="ca-pub-8259864598528617"
                data-ad-slot="9504424696"
                data-ad-format="fluid"
                data-ad-layout="in-article"
                data-full-width-responsive="true">
            </ins>
        </div>
    );
};

export {GoogleAdHorizontal, GoogleAdVertical, GoogleAdArticle};