declare module "*.jpg";
declare module "*.png";
declare module "*.pdf";
declare let isBack: boolean;

interface Window {
    isBack?: boolean;
}
