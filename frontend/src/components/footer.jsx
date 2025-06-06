import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Mon Application. Tous droits réservés.</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a
            href="/privacy"
            className="hover:text-pink-400 transition-colors"
          >
            Politique de confidentialité
          </a>
          <a
            href="/terms"
            className="hover:text-pink-400 transition-colors"
          >
            Conditions d'utilisation
          </a>
          <a
            href="mailto:support@monapp.com"
            className="hover:text-pink-400 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
