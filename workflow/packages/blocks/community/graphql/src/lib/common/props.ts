import { Property } from 'workflow-blocks-framework';
import { HttpMethod } from 'workflow-blocks-common';

const httpMethodDropdownOptions = Object.values(HttpMethod).map((m) => ({
  label: m,
  value: m,
}));

export const httpMethodDropdown = Property.StaticDropdown<HttpMethod>({
  displayName: 'Method',
  required: true,
  options: { options: httpMethodDropdownOptions },
  defaultValue: HttpMethod.POST,
});
