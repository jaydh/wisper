import * as React from 'react';

interface Props {
    active: any;
    children: any;
    onClick: any;
}

class Link extends React.Component<Props, {}> {
    render() {
        const { active, children, onClick } = this.props;
        if (active) {
            return <span>{children}</span>;
        }

        return (
            <a
                href="#"
                onClick={e => {
                    e.preventDefault();
                    onClick();
                }}
            >
                {children}
            </a>
        );
    }
}

export default Link;