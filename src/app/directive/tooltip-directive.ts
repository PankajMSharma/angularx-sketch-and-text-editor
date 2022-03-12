import { Directive, Input, ElementRef, HostListener, Renderer2 } from '@angular/core';

export declare type TOOLTIP_ACCEPTED_POSITIONS = 'auto' | 'top' | 'bottom' | 'left' | 'right';

@Directive({
  selector: '[tooltip]'
})
export class TooltipDirective {
  @Input('tooltip') tooltipTitle: string;
  @Input() tooltipPlacement: TOOLTIP_ACCEPTED_POSITIONS;
  @Input() tooltipDelay: string;
  private finalPlacement: 'top' | 'bottom' | 'left' | 'right';
  tooltip: HTMLElement;
  // Distance between host element and tooltip element
  offset = 10;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltip) { this.show(); }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltip) { this.hide(); }
  }

  show() {
    this.create();
    this.setPosition();
    this.renderer.addClass(this.tooltip, 'ng-tooltip-show');
  }

  hide() {
    this.renderer.removeClass(this.tooltip, 'ng-tooltip-show');
    window.setTimeout(() => {
      if (!this.el.nativeElement || !this.tooltip) {return;}
      this.renderer.removeChild(this.el.nativeElement, this.tooltip);
      this.tooltip = null;
    }, +this.tooltipDelay);
  }

  create() {
    this.tooltip = this.renderer.createElement('span');

    this.renderer.appendChild(
      this.tooltip,
      this.renderer.createText(this.tooltipTitle) // textNode
    );

    this.resolvePosition();

    //this.renderer.appendChild(document.body, this.tooltip);
    this.renderer.appendChild(this.el.nativeElement, this.tooltip);

    this.renderer.addClass(this.tooltip, 'ng-tooltip');
    this.renderer.addClass(this.tooltip, `ng-tooltip-${this.finalPlacement}`);

    // delay Set
    this.renderer.setStyle(this.tooltip, '-webkit-transition', `opacity ${this.tooltipDelay}ms`);
    this.renderer.setStyle(this.tooltip, '-moz-transition', `opacity ${this.tooltipDelay}ms`);
    this.renderer.setStyle(this.tooltip, '-o-transition', `opacity ${this.tooltipDelay}ms`);
    this.renderer.setStyle(this.tooltip, 'transition', `opacity ${this.tooltipDelay}ms`);
  }

  resolvePosition(): void {
    // Host element size and position information
    const hostPos = this.el.nativeElement.getBoundingClientRect();

    // tooltip Element size and position information
    const tooltipPos = this.tooltip.getBoundingClientRect();
    if (this.tooltipPlacement === 'auto') {
        if (hostPos.top < 40 && hostPos.left < 100) {
            this.finalPlacement = 'right';
        } else if (hostPos.top < 40 && (window.screen.width - hostPos.right) < 100) {
            this.finalPlacement = 'left';
        } else if ((window.screen.height - hostPos.bottom) < 40 && hostPos.left < 100) {
            this.finalPlacement = 'right';
        } else if (hostPos.bottom < 40 && (window.screen.width - hostPos.right) < 100) {
            this.finalPlacement = 'left';
        } else if (hostPos.top < 40) {
            this.finalPlacement = 'bottom';
        } else if (window.screen.height - hostPos.bottom < 40) {
            this.finalPlacement = 'top';
        } else {
            this.finalPlacement = 'top';
        }
    }

    if (!this.finalPlacement) {
        this.finalPlacement = this.tooltipPlacement as any;
    }
  }

  setPosition() {
    // Host element size and position information
    const hostPos = this.el.nativeElement.getBoundingClientRect();

    // tooltip Element size and position information
    const tooltipPos = this.tooltip.getBoundingClientRect();

    // window of scroll top
    // get BoundingClientRect method is viewport. Returns the relative position in
    // When scrolling occurs, tooltip of the element top to Vertical scroll coordinates should be reflected.
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    let top, left;

    if (this.finalPlacement === 'top') {
      top = hostPos.top - tooltipPos.height - this.offset;
      left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
    }

    if (this.finalPlacement === 'bottom') {
      top = hostPos.bottom + this.offset;
      left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
    }

    if (this.finalPlacement === 'left') {
      top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
      left = hostPos.left - tooltipPos.width - this.offset;
    }

    if (this.finalPlacement === 'right') {
      top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
      left = hostPos.right + this.offset;
    }

    // When scrolling occurs, the vertical scroll coordinate value should be reflected on the top of the tooltip element.
    this.renderer.setStyle(this.tooltip, 'top', `${top + scrollPos}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
  }
}
