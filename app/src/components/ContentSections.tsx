// Reusable Content Sections using Shadcn Accordion
 import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
 import { Icons } from "./ui/Icons";
 import { TransactionList } from "./TransactionList";
 import { Card, Transaction } from "../interfaces/common";

 type ContentSectionsProps = {
   currentCard?: Card;
   transactions?: Transaction[];
 };
 
 export const ContentSections = ({ currentCard, transactions }: ContentSectionsProps) => (
    <Accordion
      type="multiple"
      className="w-full space-y-4"
      defaultValue={["transactions"]}
    >
      <AccordionItem
        value="card-details"
        className="border border-gray-100 rounded-lg bg-white shadow-sm overflow-hidden px-0"
      >
        <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 hover:no-underline data-[state=open]:bg-gray-50/50">
          <div className="flex items-center gap-3">
            <Icons.Card
              className="text-primary-blue"
              size={20}
              fill={"#23CEFD"}
            />
            <span className="text-primary-blue font-semibold">
              Card details
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-4">
          <div className="text-gray-500 text-sm py-2">
            <p>Card ID: {currentCard?.id}</p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem
        value="transactions"
        className="border border-gray-100 rounded-lg bg-white shadow-sm overflow-hidden px-0"
      >
        <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 hover:no-underline data-[state=open]:bg-gray-50/50">
          <div className="flex items-center gap-3">
            <Icons.Transaction className="text-primary-blue" size={20} />
            <span className="text-primary-blue font-semibold text-sm">
              Recent transactions
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-4">
          <TransactionList transactions={transactions} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );