import ReactGA from 'react-ga';

export const initGA = () => {
    ReactGA.initialize('UA-166768458-1');
}

export const PageView = (name) => {
    ReactGA.pageview(name);
}

export const Event = (category, action, label) => {
    ReactGA.event({
        category: category,
        action: action,
        label: label
    });
};